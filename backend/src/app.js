// Load environment variables FIRST, before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

app.use('/api/events', eventRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start server, then connect to DB (so health check works even if DB is slow)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB().catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });
});
