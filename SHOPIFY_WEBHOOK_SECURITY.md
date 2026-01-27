# Shopify Webhook HMAC Verification - Deep Dive

## 🔐 What is HMAC?

**HMAC** stands for **Hash-based Message Authentication Code**. It's a cryptographic technique that combines:
- A **message** (the webhook payload)
- A **secret key** (only you and Shopify know)
- A **hash function** (SHA256 in our case)

Result: A unique signature that proves the message hasn't been tampered with and came from Shopify.

---

## 🎯 Why Do We Need HMAC?

### Without HMAC (Vulnerable)
```
Attacker sends fake webhook:
POST /api/webhooks/shopify → Server accepts it ❌ DANGER!
  {"order_id": "fake", "amount": 0}
  
Could be used to:
- Create fake orders
- Approve fake customers
- Inject malicious data
```

### With HMAC (Secure)
```
Shopify sends real webhook:
POST /api/webhooks/shopify
  X-Shopify-Hmac-SHA256: abc123def456...
  {"order_id": "real", "amount": $999}
  
Attacker tries to send fake webhook:
POST /api/webhooks/shopify
  X-Shopify-Hmac-SHA256: xyz789... (wrong!)
  {"order_id": "fake", "amount": 0}
  
Server rejects it ✓ PROTECTED!
```

---

## 🔄 How HMAC Works Step-by-Step

### Shopify's Side (Signing)
```
1. Shopify prepares webhook:
   payload = {"id": "12345", "email": "customer@example.com"}

2. Shopify gets the secret key:
   secret = "shpss_1a2b3c4d5e6f7g8h9i0j"

3. Shopify creates HMAC signature:
   hmac = SHA256(payload, secret)
   hmac = "abc123def456..." (64 character hex string)

4. Shopify sends both to your server:
   - Body: payload
   - Header X-Shopify-Hmac-SHA256: abc123def456...
```

### Your Server's Side (Verifying)
```
1. Your server receives the webhook:
   - payload = {"id": "12345", "email": "customer@example.com"}
   - header_hmac = "abc123def456..."

2. Your server gets the secret key:
   secret = "shpss_1a2b3c4d5e6f7g8h9i0j"

3. Your server recalculates HMAC:
   computed_hmac = SHA256(payload, secret)
   computed_hmac = "abc123def456..."

4. Your server compares:
   if computed_hmac === header_hmac:
     ✓ Authentic! Process webhook
   else:
     ✗ Fake! Reject webhook
```

---

## 💻 Implementation Code

### The Verification Function

```javascript
const crypto = require('crypto');

function verifyShopifyWebhook(req, res, next) {
  try {
    // Step 1: Extract HMAC from header
    const hmacHeader = req.get('X-Shopify-Hmac-SHA256');
    console.log('Received HMAC:', hmacHeader);
    
    // Step 2: Get the raw request body (CRITICAL!)
    // Must be the exact bytes received, no modifications
    const rawBody = req.rawBody;
    console.log('Request body:', rawBody);
    
    // Step 3: Get the webhook secret (from Shopify app settings)
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    console.log('Webhook secret configured:', !!webhookSecret);
    
    // Step 4: Calculate HMAC using SHA256
    const computedHmac = crypto
      .createHmac('sha256', webhookSecret)  // Algorithm + Key
      .update(rawBody, 'utf8')              // Data to hash
      .digest('base64');                    // Output format
    
    console.log('Computed HMAC:', computedHmac);
    
    // Step 5: Compare using timing-safe comparison
    // Prevents timing attacks where attackers guess byte-by-byte
    const isValid = crypto.timingSafeEqual(
      Buffer.from(computedHmac),
      Buffer.from(hmacHeader)
    );
    
    if (isValid) {
      console.log('✓ Webhook verified successfully');
      req.body = JSON.parse(rawBody);
      req.verified = true;
      next();
    } else {
      console.warn('✗ Webhook HMAC verification failed');
      res.status(401).json({ error: 'Unauthorized: Invalid HMAC' });
    }
    
  } catch (error) {
    console.error('Webhook verification error:', error.message);
    res.status(400).json({ error: 'Bad request' });
  }
}
```

---

## ⚠️ Critical Implementation Details

### 1. Raw Body Capture (MUST BE DONE FIRST)

❌ **Wrong Order:**
```javascript
app.use(express.json());  // ← Parses body
app.post('/webhook', verifyWebhook);  // ← Body already parsed! HMAC fails
```

✅ **Correct Order:**
```javascript
// Capture raw body BEFORE express.json()
app.use((req, res, next) => {
  if (req.path === '/webhooks/shopify') {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString('utf8');
    });
    req.on('end', () => {
      req.rawBody = data;  // ← Store exact bytes
      next();
    });
  } else {
    next();
  }
});

app.use(express.json());  // ← Now parse JSON
app.post('/webhooks/shopify', verifyWebhook);  // ← Verification succeeds
```

### 2. Timing-Safe Comparison (SECURITY)

❌ **Vulnerable (Regular String Comparison):**
```javascript
// Timing attack vulnerability!
if (computedHmac === headerHmac) {
  // An attacker can time responses to guess byte-by-byte
  // "a" fails faster than "ab" partially matching, etc.
}
```

✅ **Secure (Timing-Safe):**
```javascript
// Constant time comparison
// Takes same time regardless of where strings differ
crypto.timingSafeEqual(
  Buffer.from(computedHmac),
  Buffer.from(headerHmac)
);
```

### 3. Secret Handling

❌ **Wrong:**
```javascript
const secret = "shpss_1a2b3c4d5e6f7g8h9i0j";  // Hardcoded! ✗
```

✅ **Correct:**
```javascript
const secret = process.env.SHOPIFY_WEBHOOK_SECRET;  // From .env ✓
```

---

## 🧪 Testing HMAC Verification

### Simulate a Real Webhook

```bash
#!/bin/bash

# 1. Prepare the payload
PAYLOAD='{"id":"12345","customer":{"email":"test@example.com"}}'

# 2. Get your webhook secret
SECRET="shpss_1a2b3c4d5e6f7g8h9i0j"

# 3. Calculate HMAC (same way Shopify does)
HMAC=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -binary | base64)

# 4. Send the webhook
curl -X POST http://localhost:5000/api/webhooks/shopify/order/created \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Hmac-SHA256: $HMAC" \
  -d "$PAYLOAD"
```

### Expected Responses

**With Valid HMAC:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

**With Invalid HMAC:**
```json
{
  "error": "Unauthorized: Invalid HMAC"
}
```

---

## 🔍 Troubleshooting HMAC Verification

### Problem 1: HMAC Always Fails

**Check List:**
1. ✓ Raw body is captured before JSON parsing?
2. ✓ Secret matches exactly (check character-by-character)?
3. ✓ Base64 encoding is used?
4. ✓ SHA256 algorithm is correct?

**Debug Code:**
```javascript
console.log('Header HMAC:', hmacHeader);
console.log('Computed HMAC:', computedHmac);
console.log('Match:', hmacHeader === computedHmac);
console.log('Buffer comparison:', crypto.timingSafeEqual(
  Buffer.from(computedHmac),
  Buffer.from(hmacHeader)
));
```

### Problem 2: Raw Body is Empty

**Cause:** JSON parsing happened before webhook route

**Solution:** Ensure raw body middleware runs first:
```javascript
// WRONG:
app.use(express.json());
app.use(rawBodyMiddleware);

// RIGHT:
app.use(rawBodyMiddleware);
app.use(express.json());
```

### Problem 3: Different HMAC Each Time

This is EXPECTED! Each webhook has different data, so HMAC differs.

---

## 📚 Key Concepts

| Concept | Meaning |
|---------|---------|
| **Secret Key** | Only you and Shopify know it |
| **Payload** | The webhook data (JSON) |
| **HMAC** | Hash(payload + secret) |
| **Hash Function** | SHA256 (cryptographic function) |
| **Digest Format** | Base64 encoding of the hash |
| **Timing Attack** | Guessing secrets by measuring response time |
| **Timing-Safe** | Comparison that takes same time always |

---

## 🎓 Real-World Usage

### Example 1: Customer Signup Webhook

```javascript
app.post('/webhooks/shopify/customer/created', verifyWebhook, (req, res) => {
  // At this point, webhook is verified as authentic
  
  const customerData = req.body;
  console.log('✓ Verified customer:', customerData.email);
  
  // Safe to process customer data
  // Add to waitlist, send confirmation email, etc.
  
  res.json({ success: true });
});
```

### Example 2: Order Webhook

```javascript
app.post('/webhooks/shopify/order/created', verifyWebhook, (req, res) => {
  // Webhook is verified
  
  const orderData = req.body;
  
  // Check if customer is on waitlist
  const waitlistEntry = Waitlist.findOne({ 
    email: orderData.customer.email 
  });
  
  if (waitlistEntry) {
    // Auto-approve customer for purchase
    waitlistEntry.status = 'Approved';
    waitlistEntry.save();
  }
  
  res.json({ success: true });
});
```

---

## ✅ Security Checklist

- [ ] HMAC verification middleware in place
- [ ] Raw body captured before JSON parsing
- [ ] Timing-safe comparison used
- [ ] Secret never hardcoded (in .env)
- [ ] Error messages don't leak information
- [ ] Webhook handler tests written
- [ ] Shopify secret verified in admin panel
- [ ] HTTPS only in production

---

## 🔗 Resources

- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [Shopify Webhook Security Docs](https://shopify.dev/api/admin-rest/2024-01/resources/webhook)
- [HMAC RFC 2104](https://tools.ietf.org/html/rfc2104)
- [OWASP Timing Attacks](https://owasp.org/www-community/attacks/Timing_attack)

---

**Security is paramount! Always verify webhooks. 🔐**
