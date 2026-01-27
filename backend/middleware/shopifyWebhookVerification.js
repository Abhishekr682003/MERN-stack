const crypto = require('crypto');

/**
 * SHOPIFY WEBHOOK VERIFICATION MIDDLEWARE
 * 
 * Security Concept: HMAC (Hash-based Message Authentication Code)
 * 
 * How it works:
 * 1. Shopify sends a webhook with an HMAC header (X-Shopify-Hmac-SHA256)
 * 2. Shopify creates HMAC by signing the request body with the API secret key
 * 3. We receive the webhook and verify using the same secret
 * 4. If the computed HMAC matches the header, data is authentic and unaltered
 * 
 * Benefits:
 * - Verifies the request came from Shopify (authentication)
 * - Ensures data wasn't modified in transit (integrity)
 * - Prevents unauthorized parties from sending fake webhooks
 */

const verifyShopifyWebhook = (req, res, next) => {
  try {
    // Get HMAC from request header
    const hmacHeader = req.get('X-Shopify-Hmac-SHA256');
    
    // Get the raw request body as a string
    const rawBody = req.rawBody || '';
    
    // Get the webhook secret from environment
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('SHOPIFY_WEBHOOK_SECRET is not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    
    if (!hmacHeader) {
      console.warn('No HMAC header found in webhook request');
      return res.status(401).json({ error: 'Unauthorized: Missing HMAC header' });
    }
    
    /**
     * HMAC Verification Process:
     * 1. Create an HMAC-SHA256 hash using:
     *    - The raw request body (exactly as received)
     *    - The webhook secret as the key
     * 2. Encode the hash as base64
     * 3. Compare with the HMAC from the header using constant-time comparison
     */
    
    // Step 1 & 2: Create HMAC-SHA256 and encode as base64
    const computedHmac = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody, 'utf8')
      .digest('base64');
    
    // Step 3: Constant-time comparison to prevent timing attacks
    // Using timingSafeEqual prevents attackers from guessing the HMAC byte-by-byte
    const isValid = crypto.timingSafeEqual(
      Buffer.from(computedHmac),
      Buffer.from(hmacHeader)
    );
    
    if (!isValid) {
      console.warn('Webhook HMAC verification failed');
      return res.status(401).json({ error: 'Unauthorized: Invalid HMAC' });
    }
    
    // Verification successful - attach parsed body to request
    req.body = JSON.parse(rawBody);
    req.verified = true;
    
    console.log('✓ Shopify webhook verified successfully');
    next();
    
  } catch (error) {
    console.error('Webhook verification error:', error.message);
    return res.status(400).json({ error: 'Bad request: Invalid webhook' });
  }
};

/**
 * MIDDLEWARE SETUP INSTRUCTIONS
 * 
 * In your Express app, you need to:
 * 1. Configure Express to capture raw body for webhook routes:
 * 
 *    app.use('/api/webhooks/shopify', express.raw({ type: 'application/json' }));
 *    app.post('/api/webhooks/shopify', verifyShopifyWebhook, webhookHandler);
 * 
 * 2. Create a custom middleware to capture raw body:
 * 
 *    app.use((req, res, next) => {
 *      if (req.path === '/api/webhooks/shopify') {
 *        let data = '';
 *        req.on('data', chunk => { data += chunk; });
 *        req.on('end', () => { req.rawBody = data; next(); });
 *      } else {
 *        next();
 *      }
 *    });
 */

module.exports = verifyShopifyWebhook;
