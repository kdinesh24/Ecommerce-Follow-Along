const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', function (req, res) {
    res.send('Server is running and connected to the database!');
});

app.use('/users', userRoutes);
app.use('/items', productRoutes);

const PORT = 3000;

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to start the server:', error.message);
    }
});