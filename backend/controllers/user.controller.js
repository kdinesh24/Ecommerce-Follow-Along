const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const signup = async function(req, res) {
    try {
        const { name, email, password, isSeller } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isSeller
        });

        await newUser.save();
        
        // Don't send password in response
        const userResponse = { ...newUser.toObject() };
        delete userResponse.password;
        
        res.status(201).json({ 
            msg: 'User created successfully', 
            user: userResponse 
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

const login = async function(req, res) {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create session
        req.session.userId = user._id;
        
        // Don't send password in response
        const userResponse = { ...user.toObject() };
        delete userResponse.password;
        
        res.json({ 
            msg: 'Login successful', 
            user: userResponse 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

module.exports = { signup, login };