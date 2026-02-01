const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Mongo_url, {});
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.log('MongoDB connection failed:', err.message);
    process.exit(1);
    
  }
};

module.exports = connectDB;