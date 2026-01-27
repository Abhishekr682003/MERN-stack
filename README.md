# Limited Edition Access System - MERN Stack Skill Assessment

## 🎯 Project Overview

This is a complete MERN Stack implementation for managing a "Limited Edition Access" waitlist system with secure Shopify webhook integration. The system demonstrates professional-grade security practices, database design, and full-stack development.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Shopify Webhook Verification](#shopify-webhook-verification)
- [Database Schema](#database-schema)
- [Security Features](#security-features)

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- HMAC-SHA256 for Shopify webhook verification
- RESTful API design

**Frontend:**
- React 18
- Axios for API communication
- CSS3 for responsive design

### Project Structure

```
MERN Stack Skill Assessment/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── middleware/
│   │   └── shopifyWebhookVerification.js  # HMAC verification
│   ├── models/
│   │   └── Waitlist.js           # Mongoose schema
│   ├── routes/
│   │   ├── waitlist.js           # Waitlist CRUD endpoints
│   │   └── webhooks.js           # Shopify webhook handlers
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express app & server setup
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.js       # Main dashboard component
    │   │   └── Dashboard.css      # Dashboard styles
    │   ├── services/
    │   │   └── api.js             # API service layer
    │   ├── App.js                 # Root app component
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## 🎯 Implementation Highlights

### HMAC Security Check (Shopify Webhooks)

**How It Works:**
```
Shopify signs webhook with SHA256(payload + secret) → sends X-Shopify-Hmac-SHA256 header
Your server recalculates the same HMAC → compares using timing-safe comparison
Result: Only authentic, unmodified webhooks are processed ✓
```

**Key Features:**
- Uses `crypto.createHmac('sha256')` to create the signature
- Implements `crypto.timingSafeEqual()` to prevent timing attacks (attackers can't guess the HMAC byte-by-byte)
- Captures raw request body BEFORE JSON parsing (critical for accuracy)
- Location: `backend/middleware/shopifyWebhookVerification.js`

**Why This Matters:** Ensures that only Shopify can trigger your webhooks - unauthorized parties cannot send fake orders or customer data.

### MongoDB Schema Design

**Validation Strategy:**
- **Email:** RFC-compliant regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` + unique constraint
- **Product ID:** Alphanumeric only `/^[a-zA-Z0-9_-]{1,50}$/` prevents SQL/NoSQL injection
- **Status:** Enum validation (only Pending, Approved, Rejected allowed)
- **Automatic Timestamps:** createdAt, updatedAt, approvedAt for audit trails

**Performance Optimization:**
- Composite index on `(email, productId)` for fast lookups
- Index on `(status, createdAt)` for filtering/sorting
- Prevents duplicate entries per customer per product

**Location:** `backend/models/Waitlist.js`

---

## 📦 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas cloud)
- **npm** or **yarn** package manager

### Verify Installation

```bash
node --version
npm --version
mongod --version
---

## 🚀 Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### Backend (.env file)

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/limited-access

# Server Configuration
PORT=5000
NODE_ENV=development

# Shopify Webhook Secret
# Get this from your Shopify app settings
SHOPIFY_WEBHOOK_SECRET=your_shopify_webhook_secret_here
```

### MongoDB Setup

#### Option 1: Local MongoDB

```bash
# Start MongoDB service (Windows)
mongod

# Or use MongoDB Community Edition
# Installation guide: https://docs.mongodb.com/manual/installation/
```

#### Option 2: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/limited-access
```

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm install
npm start           # Production mode
# OR
npm run dev         # Development mode with nodemon
```

Expected output:
```
============================================================
✓ Limited Edition Access Server Started
============================================================
Server running on: http://localhost:5000
Environment: development
API Documentation:
  - Waitlist API: GET /api/waitlist
  - Health Check: GET /api/health
  - Webhooks: POST /api/webhooks/shopify/*
============================================================
```

### Start Frontend

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Waitlist Endpoints

#### 1. Get All Waitlist Entries
```
GET /waitlist
```

**Query Parameters:**
- `status` (optional): Filter by status (Pending, Approved, Rejected)
- `productId` (optional): Filter by product ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "customer@example.com",
      "name": "John Doe",
      "productId": "limited-item-001",
      "status": "Pending",
      "shopifyCustomerId": null,
      "createdAt": "2024-01-27T10:30:00Z",
      "updatedAt": "2024-01-27T10:30:00Z",
      "approvedAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

#### 2. Get Single Entry
```
GET /waitlist/:id
```

#### 3. Add Customer to Waitlist
```
POST /waitlist
Content-Type: application/json

{
  "email": "customer@example.com",
  "name": "John Doe",
  "productId": "limited-item-001",
  "shopifyCustomerId": "gid://shopify/Customer/123" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully added to waitlist",
  "data": { /* waitlist entry */ }
}
```

#### 4. Update Status
```
PUT /waitlist/:id
Content-Type: application/json

{
  "status": "Approved"
}
```

**Valid Statuses:**
- `Pending` - Awaiting review
- `Approved` - Customer approved for purchase
- `Rejected` - Customer rejected

#### 5. Delete Entry
```
DELETE /waitlist/:id
```

#### 6. Get Statistics
```
GET /waitlist/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "byStatus": {
      "Pending": 28,
      "Approved": 12,
      "Rejected": 2
    }
  }
}
```

---

## 🔐 Shopify Webhook Verification

### Understanding HMAC Verification

HMAC (Hash-based Message Authentication Code) is a cryptographic technique that ensures:

1. **Authentication**: The webhook came from Shopify (not an attacker)
2. **Integrity**: The data wasn't modified in transit
3. **Non-repudiation**: Shopify can't deny sending the webhook

### How It Works

```
┌─────────────────────────────────────────────────────┐
│ Shopify Server                                      │
│ 1. Creates webhook payload                         │
│ 2. Calculates: HMAC = SHA256(payload, secret)     │
│ 3. Sends: payload + X-Shopify-Hmac-SHA256 header  │
└─────────────────────────────────────────────────────┘
                        ↓
                  (Network Transit)
                        ↓
┌─────────────────────────────────────────────────────┐
│ Your Server                                         │
│ 1. Receives: payload + HMAC header                 │
│ 2. Calculates: computed_hmac = SHA256(payload, secret)
│ 3. Compares: computed_hmac === header_hmac         │
│ 4. If match: Webhook is authentic ✓               │
└─────────────────────────────────────────────────────┘
```

### Implementation Details

**Location:** `backend/middleware/shopifyWebhookVerification.js`

**Key Security Features:**
- Uses `crypto.createHmac()` with SHA256 algorithm
- Implements `crypto.timingSafeEqual()` to prevent timing attacks
- Validates raw request body (critical for HMAC correctness)

**Code Example:**
```javascript
const crypto = require('crypto');

const verifyShopifyWebhook = (req, res, next) => {
  const hmacHeader = req.get('X-Shopify-Hmac-SHA256');
  const rawBody = req.rawBody;
  const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET;
  
  // Calculate HMAC
  const computedHmac = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody, 'utf8')
    .digest('base64');
  
  // Constant-time comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedHmac),
    Buffer.from(hmacHeader)
  );
  
  if (isValid) {
    next(); // Webhook verified
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

### Webhook Endpoints

#### Order Created
```
POST /api/webhooks/shopify/order/created
```

**Headers Required:**
```
X-Shopify-Hmac-SHA256: [HMAC signature]
Content-Type: application/json
```

#### Customer Created
```
POST /api/webhooks/shopify/customer/created
```

#### Health Check (No verification)
```
POST /api/webhooks/health
```

### Setting Up Webhooks in Shopify

1. Go to **Shopify Admin** → **Settings** → **Apps and integrations**
2. Click **Develop apps**
3. Create a new app or select existing one
4. Go to **Configuration** section
5. Under **Admin API**, enable necessary scopes
6. Add webhook:
   - **Topic**: Orders/created or Customers/created
   - **URL**: `https://yourdomain.com/api/webhooks/shopify/order/created`
   - **API Version**: Latest stable

7. Shopify will provide the webhook secret - save this in your `.env`

---

## 📊 Database Schema

### Waitlist Collection

**Location:** `backend/models/Waitlist.js`

```javascript
{
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // Email validation regex
    lowercase: true,
    trim: true,
    index: true
  },
  
  productId: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9_-]{1,50}$/,  // Alphanumeric with hyphens/underscores
    trim: true,
    index: true
  },
  
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true
  },
  
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
    index: true
  },
  
  shopifyCustomerId: {
    type: String,
    trim: true,
    default: null
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  approvedAt: {
    type: Date,
    default: null
  }
}
```

### Indexes for Performance

- `{ email: 1, productId: 1 }` - Ensure unique per-product entries
- `{ status: 1, createdAt: -1 }` - Fast filtering and sorting
- `email` (unique index)
- `productId` (regular index)
- `createdAt` (regular index)
- `status` (regular index)

---

## 🔒 Security Features

### 1. Input Validation
- **Email validation**: RFC-compliant regex
- **Product ID validation**: Alphanumeric with hyphens/underscores only
- **Name validation**: 2-100 characters
- **Mongoose validators**: Automatic enforcement

### 2. Webhook Security
- **HMAC verification**: Cryptographic validation
- **Timing-safe comparison**: Prevents timing attacks
- **Raw body capture**: Ensures HMAC correctness

### 3. Database Security
- **Unique constraints**: Prevent duplicate entries
- **Data type enforcement**: MongoDB schema validation
- **Indexed queries**: Efficient and consistent

### 4. API Security
- **CORS configuration**: Restricted origins
- **Error handling**: No sensitive data leakage
- **Request sanitization**: XSS prevention

### 5. Environment Security
- **.env file**: Sensitive data separation
- **No hardcoded secrets**: All secrets in environment variables
- **.gitignore**: Prevents committing .env files

---

## 🧪 Testing the System

### Test 1: Add to Waitlist
```bash
curl -X POST http://localhost:5000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "productId": "limited-001"
  }'
```

### Test 2: Fetch Waitlist
```bash
curl http://localhost:5000/api/waitlist
```

### Test 3: Update Status
```bash
curl -X PUT http://localhost:5000/api/waitlist/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "Approved"}'
```

### Test 4: Get Statistics
```bash
curl http://localhost:5000/api/waitlist/stats/summary
```

### Test 5: Health Check
```bash
curl http://localhost:5000/api/health
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Verify MongoDB credentials for Atlas

### CORS Errors
- Update `FRONTEND_URL` in backend `.env` if frontend is on different port
- Check CORS middleware configuration in `server.js`

### Webhook Verification Fails
- Ensure `SHOPIFY_WEBHOOK_SECRET` matches exactly
- Verify raw body is captured before parsing
- Check logs for detailed error messages

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

---

## 📚 Key Learning Outcomes

This project demonstrates mastery of:

1. ✅ **MongoDB Schema Design**: Validation, indexing, relationships
2. ✅ **Security**: HMAC verification, input validation, error handling
3. ✅ **RESTful API Design**: Proper HTTP methods, status codes, pagination
4. ✅ **Express.js Middleware**: Custom middleware for security
5. ✅ **React State Management**: Hooks, data fetching, filtering
6. ✅ **Full-Stack Integration**: Backend/frontend communication
7. ✅ **Webhook Processing**: Asynchronous event handling
8. ✅ **Responsive UI**: Mobile-first design principles

---

## 📄 License

Educational project - MIT License

## 🤝 Support

For issues or questions, refer to individual component documentation or the inline code comments.

---

**Last Updated:** January 27, 2026
