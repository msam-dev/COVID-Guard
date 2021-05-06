const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require("mongoose");
const {Unauthorized} = require("../utils/errors");
const JWT_SECRET = config.get('JWT_SECRET');

module.exports = (usertype) => {
    return (req, res, next) => {
        // skip this for the moment
        //next();
        //return;
        const token = req.header('x-auth-token');

        // Check for token
        if (!token)
            throw new Unauthorized('No token, authorization denied');
        let decoded;
        try {
            // Verify token
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            throw new Unauthorized('Invalid token, authorization denied');
        }
        if (decoded.userType !== usertype) throw new Unauthorized('Invalid usertype for token');
        if(!mongoose.Types.ObjectId.isValid(decoded.userId)) throw new Unauthorized('UserId is invalid');
        Object.assign(req, decoded);
        next();
    };
}
