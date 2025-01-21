const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.connect("mongodb+srv://dinesh1124k:7780757556@cluster0.tmviz.mongodb.net/");
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("MongoDB connection failed");
    }
};

module.exports = connectDB;