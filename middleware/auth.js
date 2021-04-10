const jwt = require('jsonwebtoken');
const config = require('config');
JWT_SECRET = config.get('JWT_SECRET');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        // Verify token
        // Add user from payload
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};