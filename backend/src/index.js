const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);

// serve static testing pages
app.use(express.static(path.join(__dirname, '..', 'public')));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
