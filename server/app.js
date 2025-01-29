const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const db = require('./databaseConnection/db'); // Ensure database connection logic is correctly implemented
const router = require('./routes/auth.route'); // Use require for CommonJS consistency


const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3001', // Allow only requests from this domain
  methods: ['GET', 'POST'],       // Allow specific HTTP methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
};
app.use(cors(corsOptions));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/auth', router); 

// Start server
const PORT = process.env.PORT || 3000; // Use environment variable if available
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)); 
