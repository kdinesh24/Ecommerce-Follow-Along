const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Check for session
    if (req.session && req.session.user) {
        return next();
    }

    // Check for token in headers
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};