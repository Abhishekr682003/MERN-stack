require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const waitlistRoutes = require('./routes/waitlist');
const webhookRoutes = require('./routes/webhooks');

const app = express();

/**
 * MIDDLEWARE CONFIGURATION
 */

// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * RAW BODY MIDDLEWARE FOR WEBHOOK VERIFICATION
 * This must be applied BEFORE express.json()
 * Captures the raw request body for HMAC verification
 */
app.use((req, res, next) => {
  if (req.path.startsWith('/api/webhooks/shopify')) {
    let data = '';
    
    req.on('data', chunk => {
      data += chunk.toString('utf8');
    });
    
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  } else {
    next();
  }
});

// Parse JSON request bodies (but not for webhook routes)
app.use(express.json());

/**
 * HEALTH CHECK ENDPOINT
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Limited Edition Access Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * ROUTES
 */
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/webhooks', webhookRoutes);

/**
 * ROOT ROUTE
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is running 🚀'
  });
});

/**
 * ERROR HANDLING MIDDLEWARE
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * 404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

/**
 * START SERVER
 */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log('✓ Limited Edition Access Server Started');
      console.log(`${'='.repeat(60)}`);
      console.log(`Server running on: http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API Documentation:`);
      console.log(`  - Waitlist API: GET /api/waitlist`);
      console.log(`  - Health Check: GET /api/health`);
      console.log(`  - Webhooks: POST /api/webhooks/shopify/*`);
      console.log(`${'='.repeat(60)}\n`);
    });
    
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
