const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);

        const token = authHeader?.split(' ')[1];
        console.log('Extracted token:', token);

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Decoded token:', decoded);
        
        if (!decoded.userId) {
            return res.status(401).json({ message: 'Invalid token structure' });
        }

        req.userId = decoded.userId;
        console.log('Set userId in request:', req.userId);
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Invalid authentication token' });
    }
};
    
module.exports = authMiddleware;