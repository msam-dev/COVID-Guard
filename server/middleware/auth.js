const jwt = require('jsonwebtoken');
const config = require('config');
JWT_SECRET = config.get('JWT_SECRET');

module.exports = (usertype) => {
           return (req, res, next) => {
                const token = req.header('x-auth-token');

                // Check for token
                if (!token)
                    return res.status(401).json({msg: 'No token, authorization denied'});

                try {
                    // Verify token
                    // Add user from payload
                    let decoded = jwt.verify(token, JWT_SECRET);
                    if (decoded.userType !== usertype) return res.status(401).json({msg: 'Invalid usertype for token'});
                    req.user = jwt.verify(token, JWT_SECRET);
                    next();
                } catch (e) {
                    res.status(400).json({msg: 'Token is not valid'});
                }
           };
}