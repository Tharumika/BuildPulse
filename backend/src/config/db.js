const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error('ERROR: MongoDB connection string is not set.');
    console.error('Set MONGO_URI as an environment variable (e.g., in Elastic Beanstalk Environment Properties).');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DB')).join(', ') || 'none matching MONGO/DB');
    throw new Error('MONGO_URI environment variable is not defined');
  }

  try {
    // Force Google DNS for SRV resolution (some local DNS servers can't resolve SRV records)
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;
