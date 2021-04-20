const jwt = require('jsonwebtoken');
const config = require('config');
const {Unauthorized} = require("../utils/errors");
JWT_SECRET = config.get('JWT_SECRET');

module.exports = (usertype) => {
           return (req, res, next) => {
               // skip this for the moment
               next();
               return;
                const token = req.header('x-auth-token');

                // Check for token
                if (!token)
                    throw new Unauthorized('No token, authorization denied');
                try {
                    // Verify token
                    // Add user from payload
                    let decoded = jwt.verify(token, JWT_SECRET);
                    if (decoded.userType !== usertype) return res.status(401).json({msg: 'Invalid usertype for token'});
                    Object.assign(req, decoded);
                    next();
                } catch (e) {
                    throw new Unauthorized('No token, authorization denied');
                }
           };
}