const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * Handles connection with proper error handling and event listeners
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/limited-access';
    
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ MongoDB connected successfully');
    return mongoose.connection;
    
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Handle disconnection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('✗ MongoDB error:', error.message);
});

module.exports = connectDB;
