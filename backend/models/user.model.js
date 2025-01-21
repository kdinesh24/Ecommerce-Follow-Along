const mongoose = require("mongoose");

function validatePassword(password) {
    return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*(){}<>?]/.test(password)
    );
}

function validateAge(dob) {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        match: [/^[a-zA-Z0-9]+$/, "Please enter a valid name"],  // Fixed regex (removed extra space)
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, "Please enter a valid email"],  // Fixed regex (removed extra space)
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: validatePassword,
            message: "Password must contain one uppercase letter, one lowercase letter, one number, and one special character"
        },
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: validateAge,
            message: "User must be at least 18 years old"
        }
    }
});

// Use mongoose.models to prevent model overwriting
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
