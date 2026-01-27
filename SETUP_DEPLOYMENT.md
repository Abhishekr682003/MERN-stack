# 🚀 Complete Setup & Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [MongoDB Setup](#mongodb-setup)
3. [Running the Application](#running-the-application)
4. [Verifying Installation](#verifying-installation)
5. [Shopify Integration](#shopify-integration)
6. [Postman Testing](#postman-testing)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## Local Development Setup

### Prerequisites
- Node.js v14+ ([download](https://nodejs.org/))
- npm or yarn
- MongoDB (local or Atlas)
- Git
- Code Editor (VS Code recommended)

### Verify Prerequisites

```bash
# Check Node.js
node --version
# Expected: v14.0.0 or higher

# Check npm
npm --version
# Expected: 6.0.0 or higher

# Check Git
git --version
# Expected: git version 2.x.x
```

### Clone/Setup Project

```bash
# Navigate to project directory
cd "MERN Stack Skill Assessment"

# Verify structure
ls -la
# Should show: backend/, frontend/, README.md, etc.
```

---

## MongoDB Setup

### Option 1: Local MongoDB

#### Windows

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows
   - Download MSI installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Click Install

3. **Verify Installation**
   ```bash
   # Check MongoDB version
   mongod --version
   
   # Start MongoDB service
   mongod
   
   # In another terminal, test connection
   mongosh
   ```

#### macOS

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
```

#### Linux (Ubuntu)

```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with email

2. **Create Cluster**
   - Select "Free Tier"
   - Choose region (closest to you)
   - Click "Create Cluster"

3. **Setup Security**
   - Create Database User
   - Add IP Address (or 0.0.0.0/0 for development)
   - Click "Connect"

4. **Get Connection String**
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
   - Update in `backend/.env`

---

## Running the Application

### Terminal Setup

You'll need **3 terminals** running simultaneously:
1. MongoDB (if local)
2. Backend Express server
3. Frontend React app

### Terminal 1: Start MongoDB (if local)

```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
# OR
mongod
```

**Expected Output:**
```
[initandlisten] waiting for connections on port 27017
```

### Terminal 2: Start Backend

```bash
# Navigate to backend
cd backend

# First time only - install dependencies
npm install

# Start the server
npm start

# For development with auto-reload
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Limited Edition Access Server Started
============================================================
Server running on: http://localhost:5000
API Documentation:
  - Waitlist API: GET /api/waitlist
  - Health Check: GET /api/health
  - Webhooks: POST /api/webhooks/shopify/*
============================================================
```

### Terminal 3: Start Frontend

```bash
# Navigate to frontend
cd frontend

# First time only - install dependencies
npm install

# Start the development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view limited-access-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
```

The app will automatically open in your browser at http://localhost:3000

---

## Verifying Installation

### Check Backend Health

```bash
# Terminal 4: Test backend
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Limited Edition Access Server is running",
  "timestamp": "2024-01-27T10:30:00.000Z"
}
```

### Check Frontend

1. Open http://localhost:3000 in browser
2. Look for:
   - ✅ Green "Server: Online" indicator (top right)
   - ✅ Dashboard with statistics cards
   - ✅ Empty waitlist table
   - ✅ Filter and search inputs

### Add Test Customer

```bash
curl -X POST http://localhost:5000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Customer",
    "productId": "test-product-001"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully added to waitlist",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "name": "Test Customer",
    "productId": "test-product-001",
    "status": "Pending",
    ...
  }
}
```

### Verify in Frontend

1. Refresh http://localhost:3000
2. See the customer appear in the table
3. See statistics update

---

## Shopify Integration

### Getting Shopify Webhook Secret

1. **Create Shopify App**
   - Go to your Shopify store admin
   - Settings → Apps and integrations
   - Develop apps
   - Click "Create an app"
   - Name: "Limited Edition Access"
   - Create app

2. **Configure Webhooks**
   - Go to Configuration
   - Under "Admin API", enable scopes:
     - `read_orders`, `write_orders`
     - `read_customers`, `write_customers`
   - Save

3. **Get Webhook Secret**
   - Go to Webhooks section
   - Create webhook:
     - Topic: Orders/Created
     - URL: `https://yourdomain.com/api/webhooks/shopify/order/created`
   - Save and get the secret
   - Copy to `backend/.env` as `SHOPIFY_WEBHOOK_SECRET`

### Update .env

```bash
# backend/.env
SHOPIFY_WEBHOOK_SECRET=shpss_1a2b3c4d5e6f7g8h9i0j
```

### Test Webhook Verification

```bash
# Calculate HMAC (replace with real secret)
PAYLOAD='{"test":"data"}'
SECRET="shpss_1a2b3c4d5e6f7g8h9i0j"
HMAC=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -binary | base64)

# Send test webhook
curl -X POST http://localhost:5000/api/webhooks/shopify/order/created \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Hmac-SHA256: $HMAC" \
  -d "$PAYLOAD"
```

---

## Postman Testing

### Import Collection

1. **Download Postman** - https://www.postman.com/downloads/
2. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select `Postman_Collection.json`
   - Click "Import"

### Set Variables

1. Click "Limited Edition Access API" collection
2. Click "Variables" tab
3. Set `base_url`: `http://localhost:5000/api`
4. Set `customer_id`: Get from a response

### Run Tests

1. Expand collection
2. Click any request
3. Click "Send"
4. See response in panel

### Test Workflow

1. **Create** - Add customer
   - Copy returned `_id`
   - Set as `{{customer_id}}`

2. **Read** - Get customer
   - Uses `{{customer_id}}`

3. **Update** - Change status
   - Uses `{{customer_id}}`

4. **Delete** - Remove customer
   - Uses `{{customer_id}}`

---

## Troubleshooting

### MongoDB Connection Failed

```
Error: ECONNREFUSED: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# Start MongoDB
mongod

# Or check if already running
lsof -i :27017

# If port in use, restart
killall mongod
mongod
```

### Port 5000 Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
```bash
# Find process using port
lsof -i :5000

# Kill process (macOS/Linux)
kill -9 <PID>

# Windows - open Task Manager and end process
```

### Port 3000 Already in Use

```
# Change port in frontend
cd frontend
PORT=3001 npm start

# Or in .env
REACT_APP_API_URL=http://localhost:5000/api
```

### CORS Error in Frontend

```
Access to XMLHttpRequest blocked by CORS
```

**Solution:**
- Ensure backend is running on http://localhost:5000
- Update `proxy` in `frontend/package.json` if needed
- Check CORS settings in `backend/server.js`

### Dependencies Installation Fails

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### React App Won't Start

```bash
# Delete react build cache
cd frontend
rm -rf node_modules/.cache
npm start
```

### Webhook Verification Fails

**Checklist:**
- [ ] Raw body captured before JSON parsing?
- [ ] Secret matches exactly?
- [ ] Base64 encoding used?
- [ ] SHA256 algorithm correct?

---

## Production Deployment

### Backend Deployment (Render/Heroku)

1. **Prepare Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repo
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
   - Add environment variables

3. **Database Migration**
   - Use MongoDB Atlas (cloud)
   - Update `MONGODB_URI` to Atlas connection

### Frontend Deployment (Vercel/Netlify)

1. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import repository
   - Framework: Create React App
   - Deploy

2. **Update API URL**
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://your-backend.onrender.com/api
     ```
   - Redeploy

### Environment Variables

**Backend (.env on Render):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
PORT=5000
SHOPIFY_WEBHOOK_SECRET=your_secret
NODE_ENV=production
```

**Frontend (.env on Vercel):**
```
REACT_APP_API_URL=https://your-backend-url/api
```

### Setup HTTPS

- Render/Vercel provide HTTPS automatically
- Update Shopify webhook URL to HTTPS
- Test webhook delivery

### Monitor in Production

- Set up error logging (Sentry, LogRocket)
- Monitor database performance
- Set up uptime monitoring
- Configure alerts

---

## Quick Reference

| Task | Command |
|------|---------|
| Start MongoDB | `mongod` |
| Start Backend | `cd backend && npm start` |
| Start Frontend | `cd frontend && npm start` |
| Check Backend | `curl http://localhost:5000/api/health` |
| Add Customer | `curl -X POST http://localhost:5000/api/waitlist ...` |
| View Frontend | http://localhost:3000 |

---

## Support

Refer to:
- **README.md** - Complete documentation
- **QUICK_START.md** - Fast setup
- **SHOPIFY_WEBHOOK_SECURITY.md** - Security details
- **TEST_API.sh** - Automated tests

---

**You're all set! 🚀**
