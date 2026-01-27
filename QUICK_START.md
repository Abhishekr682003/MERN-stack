# Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Start MongoDB

**Windows (using MongoDB Community Edition):**
```bash
mongod
```

**Or use MongoDB Atlas (Cloud):**
- Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Copy connection string
- Update `backend/.env` with your connection string

### Step 2: Start Backend Server

```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
✓ MongoDB connected successfully
✓ Limited Edition Access Server Started
Server running on: http://localhost:5000
```

### Step 3: Start Frontend (New Terminal)

```bash
cd frontend
npm install
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view the app in the browser.
  Local:            http://localhost:3000
```

### Step 4: Test the Dashboard

1. Open http://localhost:3000 in your browser
2. You should see the admin dashboard
3. Check server status indicator (top right)

---

## 🧪 Quick Test

### Add Customer to Waitlist

```bash
curl -X POST http://localhost:5000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "name": "Alice Johnson",
    "productId": "limited-edition-2024"
  }'
```

### Refresh Dashboard
- Go to http://localhost:3000
- You should see the entry in the table
- Click status dropdown to change from "Pending" to "Approved"

### Check Statistics
See the stat cards update in real-time

---

## 🔍 Understanding the Architecture

```
User Browser (React)
    ↓ HTTP Requests (Axios)
Frontend Dashboard
    ↓ REST API Calls
Backend Server (Express)
    ↓ Queries/Updates
MongoDB Database
    ↓ Webhooks (Shopify)
Express Webhook Handler
    ↓ HMAC Verification
Database Updates
```

---

## 📌 Key Features

### ✅ Admin Dashboard
- View all waitlist entries
- Filter by status or product ID
- Update customer status (Pending → Approved/Rejected)
- Delete entries
- View statistics

### ✅ API
- RESTful endpoints for CRUD operations
- Pagination support
- Filtering capabilities
- Statistics aggregation

### ✅ Security
- HMAC verification for Shopify webhooks
- Email validation
- Product ID validation
- Unique constraint enforcement
- Sensitive data protection

### ✅ Database
- Mongoose schema with validation
- Indexed queries for performance
- Timestamps for tracking
- Status tracking

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Start `mongod` or update `MONGODB_URI` in `.env` |
| Port 5000 in use | Kill existing process: `lsof -i :5000 \| grep LISTEN \| awk '{print $2}' \| xargs kill -9` |
| Port 3000 in use | Change in frontend `.env` or kill existing process |
| CORS errors | Ensure backend is running on http://localhost:5000 |
| Server offline indicator | Check terminal for errors, restart server |

---

## 📚 Next Steps

1. **Explore API** - Test all endpoints with curl or Postman
2. **Study HMAC** - Review `backend/middleware/shopifyWebhookVerification.js`
3. **Check Schema** - Understand validation in `backend/models/Waitlist.js`
4. **Review Security** - See input validation and error handling
5. **Connect Shopify** - Follow webhook setup instructions in README.md

---

## 💡 File Structure Quick Reference

```
backend/
  ├── server.js              ← Start here! Main Express app
  ├── models/Waitlist.js     ← Database schema with validation
  ├── middleware/            ← HMAC verification for security
  └── routes/                ← API endpoints and webhook handlers

frontend/
  ├── src/App.js             ← Root component with server status
  ├── src/components/
  │   └── Dashboard.js       ← Main admin interface
  └── src/services/
      └── api.js             ← API communication layer
```

---

## 🎓 Learning Resources

- **MongoDB Schema Design**: See inline comments in `Waitlist.js`
- **HMAC Security**: See detailed explanation in `shopifyWebhookVerification.js`
- **REST API Design**: Study all endpoints in `waitlist.js`
- **React Hooks**: See useState/useEffect in `Dashboard.js`
- **API Service Pattern**: See service layer in `services/api.js`

---

**Ready to go! 🚀**
