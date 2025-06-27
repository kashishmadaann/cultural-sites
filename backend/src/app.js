const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config(); // Load from backend root (default behavior)

// Debug: Check if env vars are loaded
console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'LOADED' : 'NOT LOADED');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'NOT LOADED');

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const culturalSiteRoutes = require('./routes/culturalSiteRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
// Import other routes for reviews later

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS - configure properly for production
app.use(cors()); // For development, allows all origins.

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/sites', culturalSiteRoutes);
app.use('/api/favorites', favoriteRoutes);
// app.use('/api/reviews', reviewRoutes);

// Global error handler (should be last middleware)
app.use(errorHandler);

module.exports = app; 