const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.connect(`${process.env.MONGO_URI}`);
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("MongoDB connection failed");
    }
};

module.exports = connectDB;