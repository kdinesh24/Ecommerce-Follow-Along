const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Import the User model

const wishlistAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find the user to ensure they exist and attach the full user object
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach the entire user object to the request
        req.user = user;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Invalid authentication token' });
    }
};
    
module.exports = wishlistAuth;