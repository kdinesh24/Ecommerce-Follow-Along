const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require("../config/cloudinary");
const { Readable } = require('stream');

const bufferToStream = (buffer) => {
    return new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        },
    });
};

const signup = async (req, res) => {
    try {
        const { name, email, password, isSeller } = req.body;
        console.log("Received signup data:", { name, email, password, isSeller });

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide name, email, and password' 
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            isSeller: Boolean(isSeller)
        });

        // Save user
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: newUser._id,
                email: newUser.email,
                isSeller: newUser.isSeller 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Prepare user response (exclude sensitive data)
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isSeller: newUser.isSeller,
            imageUrl: newUser.imageUrl,
            createdAt: newUser.createdAt
        };

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/'
        });

        // Send response
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during signup',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

  
  

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        const userResponse = { ...user.toObject() };
        delete userResponse.password;

        res.json({
            message: 'Login successful',
            user: userResponse,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        let imageUrl = null;

        if (req.file) {
            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "profile_photos" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    bufferToStream(req.file.buffer).pipe(stream);
                });
                imageUrl = uploadResult.secure_url;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(400).json({ message: 'Image upload failed' });
            }
        }

        if (email) {
            const existingUser = await User.findOne({ 
                email, 
                _id: { $ne: req.userId } 
            });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const updateData = {
            ...(name && { name }),
            ...(email && { email }),
            ...(imageUrl && { imageUrl })
        };

        const user = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('isSeller');
        res.json({ isSeller: user.isSeller });
    } catch (error) {
        console.error('Get role error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { isSeller } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { isSeller },
            { new: true }
        ).select('-password');
        
        res.json({ message: 'Role updated', user });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    signup,
    login,
    logout,
    checkAuth,
    updateProfile,
    getUserRole,
    updateUserRole
};