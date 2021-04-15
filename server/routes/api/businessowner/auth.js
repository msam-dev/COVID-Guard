const express = require('express')
const router = express.Router();
const BusinessUser = require('../../../models/BusinessUser')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')

/**
 * @route   POST api/login
 * @desc    logging in user
 * @access  Private
 */

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await BusinessUser.findOne({ email });
    if (!user) throw new BadRequest('User does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequest('Invalid credentials');

    const token = jwt.sign({ id: user._id, type: userType.BUSINESS }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw new BadRequest('Couldn\'t sign the token');

    res.status(200).json({
        token,
        userId: user._id,
        type: userType.BUSINESS
    });
}));
module.exports = router;