const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user.routes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

app.get('/', function (req, res) {
    res.send('Server is running and connected to the database!');
});

app.use('/api/users', userRoutes);

const PORT =  3000;  // Changed port number and removed any semicolon

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to start the server:', error.message);
    }
});