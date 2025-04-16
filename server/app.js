require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./databaseConnection/db');
const authRouter = require('./routes/auth.route');

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3001', // Match your frontend (was 3001)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(cookieParser());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', authRouter); // Changed from /auth to /api

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 5000; // Changed to 5000 to match previous
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  // Verify database connection
  db.query('SELECT 1')
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection failed:', err));
});