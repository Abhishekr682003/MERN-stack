const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    // Customer email - validated with email regex
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ],
      unique: true,
      index: true
    },
    
    // Product ID - strict string validation
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      trim: true,
      match: [/^[a-zA-Z0-9_-]{1,50}$/, 'Product ID must be alphanumeric with hyphens/underscores'],
      index: true
    },
    
    // Customer name
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    
    // Waitlist status
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: 'Status must be Pending, Approved, or Rejected'
      },
      default: 'Pending',
      index: true
    },
    
    // Shopify customer ID (optional, for verification)
    shopifyCustomerId: {
      type: String,
      trim: true,
      default: null
    },
    
    // Timestamp when customer was added
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    
    // Timestamp for last status update
    updatedAt: {
      type: Date,
      default: Date.now
    },
    
    // For tracking approval timestamp
    approvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'waitlist'
  }
);

// Pre-save middleware to validate timestamps
waitlistSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (this.status === 'Approved' && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  next();
});

// Create indexes for performance
waitlistSchema.index({ email: 1, productId: 1 });
waitlistSchema.index({ status: 1, createdAt: -1 });

// Create Waitlist model
const Waitlist = mongoose.model('Waitlist', waitlistSchema);

module.exports = Waitlist;
