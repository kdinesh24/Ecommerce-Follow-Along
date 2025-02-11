const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        let token;

        // Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // If no token in header, check cookies
        if (!token && req.cookies) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        console.log('Token:', token); // Debugging line

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token verification failed' });
    }
};

module.exports = authMiddleware