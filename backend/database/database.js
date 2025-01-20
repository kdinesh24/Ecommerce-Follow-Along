const mongoose = require('mongoose');

async function connectDB() {
    try {
        const conn = await mongoose.connect(
            "mongodb+srv://dinesh1124k:7780757556@cluster0.tmviz.mongodb.net/ecomm"
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;