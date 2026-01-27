const express = require('express');
const router = express.Router();
const verifyShopifyWebhook = require('../middleware/shopifyWebhookVerification');
const Waitlist = require('../models/Waitlist');

/**
 * POST /api/webhooks/shopify/order/created
 * Receives webhook when a Shopify order is created
 * This endpoint verifies the webhook using HMAC before processing
 */
router.post('/shopify/order/created', verifyShopifyWebhook, async (req, res) => {
  try {
    // At this point, webhook has been verified by middleware
    const orderData = req.body;
    
    console.log('Processing Shopify order webhook:', orderData.id);
    
    // Example: Check if customer is on waitlist
    if (orderData.customer && orderData.customer.email) {
      const email = orderData.customer.email;
      
      // Find waitlist entries for this customer
      const waitlistEntries = await Waitlist.find({ email });
      
      // You can implement custom logic here
      // For example: automatically approve if customer purchases
      
      console.log(`Found ${waitlistEntries.length} waitlist entries for ${email}`);
    }
    
    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook',
      message: error.message
    });
  }
});

/**
 * POST /api/webhooks/shopify/customer/created
 * Receives webhook when a customer is created in Shopify
 */
router.post('/shopify/customer/created', verifyShopifyWebhook, async (req, res) => {
  try {
    const customerData = req.body;
    
    console.log('Processing Shopify customer creation webhook:', customerData.id);
    
    // You can implement logic to sync customer data
    // Store Shopify customer ID with waitlist entries
    
    res.json({
      success: true,
      message: 'Customer webhook processed successfully'
    });
    
  } catch (error) {
    console.error('Error processing customer webhook:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook',
      message: error.message
    });
  }
});

/**
 * POST /api/webhooks/health
 * Health check endpoint for webhook validation
 * This endpoint does NOT require HMAC verification
 */
router.post('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Webhook endpoint is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

module.exports = router;
