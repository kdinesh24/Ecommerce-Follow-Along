const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const paymentRouter = require('./routes/payment.routes')
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
  origin: process.env.FRONTEND_URL,
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
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

app.use(passport.initialize());
app.use(passport.session());


require('./config/passport')(app);


app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/items', productRoutes);
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/pay' ,paymentRouter)


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
