const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from different possible sources
        const token = 
            req.cookies.token || // Check cookies first
            req.headers.authorization?.split(' ')[1] || // Then Bearer token
            req.header('x-auth-token'); // Then custom header

        if (!token) {
            console.log('No authentication token found');
            return res.status(401).json({ message: 'Authentication required' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            // Add user ID to request
            req.userId = decoded.userId;
            
            console.log('Authentication successful for user:', decoded.userId);
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Invalid authentication token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Server error during authentication' });
    }
};

module.exports = authMiddleware;