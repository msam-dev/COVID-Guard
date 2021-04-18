const express = require('express')
const router = express.Router();
const BusinessUser = require('../../../models/BusinessUser')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes");
const {BadRequest} = require('../../../utils/errors');
const asyncHandler = require('express-async-handler');
const encryptPassword = require("../../../utils/encryptPassword");
const Business = require("../../../models/Business");
const Address = require("../../../models/Address");
const mongoose = require("mongoose");
const {Unauthorized} = require("../../../utils/errors");
const {ServerError} = require("../../../utils/errors");

/**
 * @route   POST api/businessowner/auth/login
 * @desc    logging in user
 * @access  Public
 */

router.post('/login', asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    // Simple validation
    if (!email || !password) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await BusinessUser.findOne({email});
    if (!user) throw new BadRequest('User does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequest('Invalid credentials');

    const token = jwt.sign({id: user._id, type: userType.BUSINESS}, JWT_SECRET, {expiresIn: 3600});
    if (!token) throw new BadRequest('Couldn\'t sign the token');

    res.status(200).json({
        success: true,
        token,
        userId: user._id,
        type: userType.BUSINESS
    });
}));

/**
 * @route   POST api/businessowner/auth/register
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password, phone, ABN, businessName, addressLine1, addressLine2, suburb, city, state, postcode} = req.body;
    // Simple validation
    if (!firstName || !lastName || !email || !password || !ABN || !businessName || !addressLine1 || !suburb || !city || !state || !postcode) {
        throw new BadRequest('Please enter all fields');
    }

    const user = await BusinessUser.findOne({email});
    if (user) throw new BadRequest('User already exists');

    const hash = await encryptPassword(password);

    const newAddress = new Address({
        addressLine1,
        addressLine2,
        suburb,
        city,
        state,
        postcode
    });

    const savedAddress = await newAddress.save();
    if (!savedAddress) throw new ServerError('Something went wrong saving the user');

    const newBusiness = new Business({
        ABN,
        name: businessName,
        address: newAddress
    });
    const savedBusiness = await newBusiness.save();
    if (!savedBusiness) throw new ServerError('Something went wrong saving the user');

    const newUser = new BusinessUser({
        firstName,
        lastName,
        email,
        password: hash,
        phone: phone,
        business: newBusiness
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw new ServerError('Something went wrong saving the user');

    const token = jwt.sign({id: savedUser._id, type: userType.BUSINESS}, JWT_SECRET, {
        expiresIn: 3600
    });

    res.status(200).json({
        success: true,
        token,
        userId: savedUser._id,
        type: userType.BUSINESS
    });
}));


/*
* @route   POST api/businessowner/auth/changepassword
* @desc    Change password
* @access  Private
*/

router.post('/changepassword', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    const { userId, currentPassword, newPassword, confirmPassword } = req.body;

    // Simple validation
    if (!userId || !currentPassword || !newPassword || !confirmPassword) {
        throw new BadRequest('Please enter all fields');
    }

    if (newPassword !== confirmPassword) {
        throw new BadRequest('Password and confirm password do not match');
    }

    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(userId)) throw new BadRequest('UserId is invalid');

    // Check for existing user
    const user = await BusinessUser.findById(userId);
    if (!user) throw new BadRequest('User does not exist');

    const isMatchCurrent = await bcrypt.compare(currentPassword, user.password);
    if (!isMatchCurrent) throw new BadRequest('Current password doesn\'t match');

    const hash = await encryptPassword(newPassword);
    user.password = hash;

    const savedUser = await user.save();

    if (!savedUser) throw new ServerError('Something went wrong saving the user');
    res.status(200).json({
        success: true,
        userId: savedUser.id,
    });
}));

/*
* @route   GET api/businessowner/auth/user
* @desc    Check user valid
* @access  Private
*/

router.get('/user', authMiddleware(userType.BUSINESS), asyncHandler(async (req, res) => {
    // check id is valid
    if(!mongoose.Types.ObjectId.isValid(req.userId)) throw new BadRequest('UserId is invalid');

    const user = await BusinessUser.findById(req.userId).select('-password');
    if (!user) throw new Unauthorized('User does not exist');
    res.json({id: user.id, type: userType.BUSINESS});
}));

module.exports = router;