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
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required only for non-Google users
        },
        validate: {
            validator: function(password) {
                if (this.googleId) return true; // Skip validation for Google users
                return validatePassword(password);
            },
            message: "Password must contain one uppercase letter, one lowercase letter, one number, and one special character"
        },
    },
    dob: {
        type: Date,
        required: function() {
            return !this.googleId; // DOB is required only for non-Google users
        },
        validate: {
            validator: function(dob) {
                if (this.googleId) return true; // Skip validation for Google users
                return validateAge(dob);
            },
            message: "User must be at least 18 years old"
        }
    },
    // Google OAuth fields
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    displayName: String,
    image: String,
    // Add any other fields you want to track
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Use mongoose.models to prevent model overwriting
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;