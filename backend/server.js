const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const authRoutes = require('./routes/auth.routes');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using https
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport configuration
require('./config/passport')(app);

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/items', productRoutes);
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/wishlist', wishlistRoutes);

// Debug route
app.get('/', (req, res) => {
  res.send({
    message: 'Server is running',
    authenticated: req.isAuthenticated(),
    user: req.user
  });
});

const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to start the server:', error.message);
  }
});