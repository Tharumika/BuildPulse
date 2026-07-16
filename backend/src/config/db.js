const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // force Google DNS for SRV resolution (some local DNS servers can't resolve SRV records)
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
