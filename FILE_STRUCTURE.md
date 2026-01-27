# 📂 Project File Structure & Description

## Complete File Listing

```
MERN Stack Skill Assessment/
│
├── 📄 README.md                          [COMPREHENSIVE DOCUMENTATION]
│   ├─ Architecture overview
│   ├─ Installation instructions
│   ├─ Complete API documentation
│   ├─ HMAC verification explanation
│   ├─ Database schema details
│   ├─ Security features
│   └─ Troubleshooting guide
│
├── 📄 QUICK_START.md                     [5-MINUTE SETUP GUIDE]
│   ├─ Fast installation steps
│   ├─ Quick test commands
│   ├─ Architecture diagram
│   ├─ Key features list
│   ├─ Troubleshooting table
│   └─ Learning resources
│
├── 📄 SHOPIFY_WEBHOOK_SECURITY.md        [DEEP-DIVE SECURITY]
│   ├─ HMAC concept explanation
│   ├─ Step-by-step verification
│   ├─ Implementation details
│   ├─ Critical considerations
│   ├─ Testing guide
│   ├─ Troubleshooting tips
│   └─ Security checklist
│
├── 📄 SETUP_DEPLOYMENT.md                [COMPLETE SETUP GUIDE]
│   ├─ Local development setup
│   ├─ MongoDB installation
│   ├─ Running the application
│   ├─ Shopify integration
│   ├─ Postman testing
│   ├─ Troubleshooting
│   └─ Production deployment
│
├── 📄 PROJECT_SUMMARY.md                 [PROJECT OVERVIEW]
│   ├─ Complete implementation checklist
│   ├─ Key features list
│   ├─ Architecture highlights
│   ├─ Learning outcomes
│   ├─ File structure
│   └─ Next steps
│
├── 📄 TEST_API.sh                        [AUTOMATED TEST SUITE]
│   ├─ 20 different test scenarios
│   ├─ All API endpoint tests
│   ├─ Validation testing
│   ├─ Error handling tests
│   └─ Example use cases
│
├── 📄 Postman_Collection.json            [POSTMAN COLLECTION]
│   ├─ All API endpoints
│   ├─ Example requests
│   ├─ Validation tests
│   ├─ Webhook examples
│   └─ Variable management
│
├── 📄 .gitignore                         [GIT IGNORE]
│   ├─ Backend ignores
│   ├─ Frontend ignores
│   ├─ IDE files
│   ├─ OS files
│   └─ Dependencies
│
├── 📁 backend/                           [EXPRESS + MONGODB]
│   │
│   ├── server.js                         [EXPRESS SERVER - MAIN ENTRY]
│   │   ├─ CORS configuration
│   │   ├─ Middleware pipeline
│   │   ├─ Raw body capture
│   │   ├─ Error handling
│   │   ├─ Route setup
│   │   └─ Server startup
│   │
│   ├── package.json                      [DEPENDENCIES]
│   │   ├─ Express
│   │   ├─ Mongoose
│   │   ├─ CORS
│   │   ├─ Dotenv
│   │   └─ Nodemon (dev)
│   │
│   ├── .env                              [ENVIRONMENT VARIABLES]
│   │   ├─ MONGODB_URI
│   │   ├─ PORT
│   │   ├─ SHOPIFY_WEBHOOK_SECRET
│   │   └─ NODE_ENV
│   │
│   ├── .env.example                      [ENV TEMPLATE]
│   │   └─ Example configuration
│   │
│   ├── 📁 config/
│   │   └── database.js                   [DATABASE CONNECTION]
│   │       ├─ MongoDB connection
│   │       ├─ Error handling
│   │       └─ Event listeners
│   │
│   ├── 📁 models/
│   │   └── Waitlist.js                   [MONGOOSE SCHEMA]
│   │       ├─ Email validation regex
│   │       ├─ Product ID validation
│   │       ├─ Status enum
│   │       ├─ Timestamps
│   │       ├─ Pre-save middleware
│   │       ├─ Indexes
│   │       └─ Data validation
│   │
│   ├── 📁 middleware/
│   │   └── shopifyWebhookVerification.js [HMAC VERIFICATION]
│   │       ├─ HMAC calculation
│   │       ├─ Timing-safe comparison
│   │       ├─ Raw body handling
│   │       ├─ Error handling
│   │       └─ Detailed comments
│   │
│   ├── 📁 routes/
│   │   ├── waitlist.js                   [WAITLIST CRUD ENDPOINTS]
│   │   │   ├─ GET /waitlist (all)
│   │   │   ├─ GET /waitlist/:id (single)
│   │   │   ├─ POST /waitlist (create)
│   │   │   ├─ PUT /waitlist/:id (update)
│   │   │   ├─ DELETE /waitlist/:id (delete)
│   │   │   └─ GET /waitlist/stats/summary
│   │   │
│   │   └── webhooks.js                   [WEBHOOK HANDLERS]
│   │       ├─ POST /webhooks/shopify/order/created
│   │       ├─ POST /webhooks/shopify/customer/created
│   │       └─ POST /webhooks/health
│   │
│
├── 📁 frontend/                          [REACT APP]
│   │
│   ├── package.json                      [DEPENDENCIES]
│   │   ├─ React 18
│   │   ├─ React DOM
│   │   ├─ Axios
│   │   └─ React Scripts
│   │
│   ├── 📁 public/
│   │   └── index.html                    [HTML ENTRY POINT]
│   │       └─ React app container
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── index.js                      [APP ENTRY POINT]
│   │   │   └─ React root render
│   │   │
│   │   ├── index.css                     [GLOBAL STYLES]
│   │   │   └─ Reset, fonts, defaults
│   │   │
│   │   ├── App.js                        [ROOT COMPONENT]
│   │   │   ├─ Server health check
│   │   │   ├─ Status indicator
│   │   │   ├─ Error banner
│   │   │   └─ Dashboard render
│   │   │
│   │   ├── App.css                       [APP STYLES]
│   │   │   ├─ Status indicator
│   │   │   ├─ Error banner
│   │   │   ├─ Global styles
│   │   │   └─ Responsive design
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── Dashboard.js              [MAIN DASHBOARD COMPONENT]
│   │   │   │   ├─ Fetch waitlist
│   │   │   │   ├─ Display in table
│   │   │   │   ├─ Filter by status
│   │   │   │   ├─ Filter by product ID
│   │   │   │   ├─ Update status
│   │   │   │   ├─ Delete entries
│   │   │   │   ├─ Pagination
│   │   │   │   ├─ Statistics display
│   │   │   │   ├─ Error handling
│   │   │   │   └─ Loading states
│   │   │   │
│   │   │   └── Dashboard.css             [DASHBOARD STYLES]
│   │   │       ├─ Statistics cards
│   │   │       ├─ Filter inputs
│   │   │       ├─ Table styling
│   │   │       ├─ Status indicators
│   │   │       ├─ Pagination controls
│   │   │       ├─ Responsive grid
│   │   │       ├─ Color coding
│   │   │       └─ Hover effects
│   │   │
│   │   └── 📁 services/
│   │       └── api.js                    [API SERVICE LAYER]
│   │           ├─ Axios instance
│   │           ├─ Base URL config
│   │           ├─ waitlistAPI object
│   │           ├─ getAll()
│   │           ├─ getById()
│   │           ├─ create()
│   │           ├─ updateStatus()
│   │           ├─ delete()
│   │           ├─ getStats()
│   │           └─ Error handling
│
└── 📁 node_modules/                      [DEPENDENCIES - AUTO GENERATED]
    ├─ Generated by npm install
    ├─ Listed in .gitignore
    └─ Not included in repo
```

---

## File Descriptions

### Backend Files

#### `server.js` (Main Entry Point)
- Initializes Express app
- Sets up middleware (CORS, JSON parsing, raw body capture)
- Configures routes
- Connects to MongoDB
- Starts HTTP server on port 5000

#### `config/database.js` (Database Connection)
- MongoDB connection management
- Connection pooling
- Error handling
- Event listeners for disconnection

#### `models/Waitlist.js` (Data Schema)
- Mongoose schema definition
- Email validation (RFC-compliant regex)
- Product ID validation (alphanumeric only)
- Name validation (2-100 chars)
- Status enum (Pending, Approved, Rejected)
- Timestamps and indexes
- Pre-save middleware

#### `middleware/shopifyWebhookVerification.js` (Security)
- HMAC-SHA256 verification
- Timing-safe comparison (prevents timing attacks)
- Raw body capture
- Error handling
- Detailed inline documentation

#### `routes/waitlist.js` (API Endpoints)
- GET /waitlist - Fetch all entries with pagination
- GET /waitlist/:id - Get single entry
- POST /waitlist - Add customer
- PUT /waitlist/:id - Update status
- DELETE /waitlist/:id - Remove entry
- GET /waitlist/stats/summary - Get statistics

#### `routes/webhooks.js` (Webhook Handlers)
- POST /webhooks/shopify/order/created
- POST /webhooks/shopify/customer/created
- POST /webhooks/health

### Frontend Files

#### `index.js` (React Entry Point)
- Renders React app to DOM
- Mounts root component

#### `App.js` (Root Component)
- Server health check on mount
- Status indicator display
- Error banner if server down
- Dashboard component render

#### `components/Dashboard.js` (Main UI)
- Statistics display
- Waitlist table
- Filter inputs
- Status dropdowns
- Pagination controls
- Delete buttons
- Real-time updates

#### `services/api.js` (API Layer)
- Axios instance configuration
- All API method wrappers
- Error handling
- Consistent API interface

### Configuration Files

#### `.env` (Environment Variables)
- Database URI
- Server port
- Shopify webhook secret
- Node environment

#### `package.json` (Dependencies)
- Backend: Express, Mongoose, CORS, dotenv
- Frontend: React, Axios, react-scripts

### Documentation Files

#### `README.md` - Full Documentation
Complete guide with architecture, API docs, security details

#### `QUICK_START.md` - Fast Setup
5-minute setup guide with common tasks

#### `SHOPIFY_WEBHOOK_SECURITY.md` - Security Deep-Dive
Detailed explanation of HMAC verification

#### `SETUP_DEPLOYMENT.md` - Full Setup Guide
Complete installation and deployment instructions

#### `PROJECT_SUMMARY.md` - Project Overview
Summary of implementation and learning outcomes

#### `TEST_API.sh` - Automated Tests
20 test scenarios for all endpoints

#### `Postman_Collection.json` - Postman Collection
Ready-to-import API collection for testing

---

## File Statistics

| Category | Count | Size (Est.) |
|----------|-------|------------|
| Backend Files | 6 | 15 KB |
| Frontend Files | 8 | 20 KB |
| Config Files | 4 | 2 KB |
| Documentation | 6 | 100+ KB |
| Total Code Files | 18 | ~37 KB |
| Total Project | 28+ | 130+ KB |

---

## Development Workflow

### Getting Started
1. Read: `QUICK_START.md`
2. Setup: Follow `SETUP_DEPLOYMENT.md`
3. Learn: Review `README.md`

### During Development
1. Make changes
2. Test: Use `TEST_API.sh` or Postman
3. Check: Review inline comments
4. Understand: Read relevant docs

### For Deployment
1. Review: `SETUP_DEPLOYMENT.md` deployment section
2. Configure: Update `.env` for production
3. Deploy: Push to Render/Vercel
4. Monitor: Set up logging

### For Security
1. Read: `SHOPIFY_WEBHOOK_SECURITY.md`
2. Review: `shopifyWebhookVerification.js`
3. Test: HMAC verification tests
4. Deploy: Use HTTPS only

---

## Key Files for Each Task

| Task | Files to Read |
|------|--------------|
| Add Customer | routes/waitlist.js, models/Waitlist.js |
| Verify Webhook | middleware/shopifyWebhookVerification.js |
| Display Dashboard | components/Dashboard.js, services/api.js |
| Update Status | routes/waitlist.js, components/Dashboard.js |
| Deploy | SETUP_DEPLOYMENT.md, .env |
| Understand Security | SHOPIFY_WEBHOOK_SECURITY.md |

---

## File Dependencies

```
server.js
├── config/database.js
├── middleware/shopifyWebhookVerification.js
├── routes/waitlist.js
│   └── models/Waitlist.js
├── routes/webhooks.js
│   └── middleware/shopifyWebhookVerification.js
└── .env

App.js
├── components/Dashboard.js
│   ├── services/api.js
│   └── components/Dashboard.css
├── App.css
└── services/api.js
```

---

## Total Lines of Code

- Backend: ~600 lines (including comments)
- Frontend: ~400 lines (including comments)
- Documentation: ~2000 lines
- **Total: ~3000 lines of production-quality code**

---

## Next Steps

1. ✅ Understand file structure (you're here!)
2. ⏭️ Setup project (SETUP_DEPLOYMENT.md)
3. ⏭️ Run backend (npm start)
4. ⏭️ Run frontend (npm start)
5. ⏭️ Test API (TEST_API.sh)
6. ⏭️ Explore dashboard (http://localhost:3000)
7. ⏭️ Read security (SHOPIFY_WEBHOOK_SECURITY.md)
8. ⏭️ Deploy (SETUP_DEPLOYMENT.md)

---

**Ready to explore the code! 🚀**
