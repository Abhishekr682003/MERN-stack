const express = require('express');
const router = express.Router();
const Waitlist = require('../models/Waitlist');

/**
 * GET /api/waitlist
 * Fetch all waitlist entries with optional filtering
 * Query parameters:
 *   - status: Filter by status (Pending, Approved, Rejected)
 *   - productId: Filter by product ID
 *   - page: Pagination page number (default: 1)
 *   - limit: Results per page (default: 10)
 */
router.get('/', async (req, res) => {
  try {
    const { status, productId, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (productId) filter.productId = productId;
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Fetch waitlist entries
    const waitlist = await Waitlist.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Waitlist.countDocuments(filter);
    
    res.json({
      success: true,
      data: waitlist,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching waitlist:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch waitlist',
      message: error.message 
    });
  }
});

/**
 * GET /api/waitlist/:id
 * Fetch a single waitlist entry by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const entry = await Waitlist.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ 
        success: false, 
        error: 'Waitlist entry not found' 
      });
    }
    
    res.json({ success: true, data: entry });
    
  } catch (error) {
    console.error('Error fetching entry:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch entry',
      message: error.message 
    });
  }
});

/**
 * POST /api/waitlist
 * Add a customer to the waitlist
 * Body:
 *   - email: Customer email (required, unique)
 *   - name: Customer name (required)
 *   - productId: Product ID (required)
 *   - shopifyCustomerId: Shopify customer ID (optional)
 */
router.post('/', async (req, res) => {
  try {
    const { email, name, productId, shopifyCustomerId } = req.body;
    
    // Check if email already exists for this product
    const existing = await Waitlist.findOne({ email, productId });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'This customer is already on the waitlist for this product' 
      });
    }
    
    // Create new waitlist entry
    const newEntry = new Waitlist({
      email,
      name,
      productId,
      shopifyCustomerId: shopifyCustomerId || null,
      status: 'Pending'
    });
    
    // Save to database (validation happens automatically)
    await newEntry.save();
    
    console.log(`✓ New waitlist entry created: ${email} for product ${productId}`);
    
    res.status(201).json({
      success: true,
      message: 'Successfully added to waitlist',
      data: newEntry
    });
    
  } catch (error) {
    console.error('Error creating waitlist entry:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: messages 
      });
    }
    
    // Handle duplicate key error (unique email)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already exists in waitlist' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create waitlist entry',
      message: error.message 
    });
  }
});

/**
 * PUT /api/waitlist/:id
 * Update waitlist entry status
 * Body:
 *   - status: New status (Pending, Approved, or Rejected)
 *   - notes: Optional notes about the status change
 */
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    // Find and update entry
    const entry = await Waitlist.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: new Date(),
        ...(status === 'Approved' && { approvedAt: new Date() })
      },
      { new: true, runValidators: true }
    );
    
    if (!entry) {
      return res.status(404).json({ 
        success: false, 
        error: 'Waitlist entry not found' 
      });
    }
    
    console.log(`✓ Waitlist entry updated: ${entry.email} status changed to ${status}`);
    
    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: entry
    });
    
  } catch (error) {
    console.error('Error updating waitlist entry:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update waitlist entry',
      message: error.message 
    });
  }
});

/**
 * DELETE /api/waitlist/:id
 * Remove a customer from the waitlist
 */
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Waitlist.findByIdAndDelete(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ 
        success: false, 
        error: 'Waitlist entry not found' 
      });
    }
    
    console.log(`✓ Waitlist entry deleted: ${entry.email}`);
    
    res.json({
      success: true,
      message: 'Waitlist entry removed',
      data: entry
    });
    
  } catch (error) {
    console.error('Error deleting waitlist entry:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete waitlist entry',
      message: error.message 
    });
  }
});

/**
 * GET /api/waitlist/stats/summary
 * Get waitlist statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Waitlist.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await Waitlist.countDocuments();
    
    res.json({
      success: true,
      data: {
        total,
        byStatus: stats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
});

module.exports = router;
