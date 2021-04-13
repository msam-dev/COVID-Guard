const express = require('express')
const router = express.Router();
const RegisteredGeneralPublicUser = require('../../../models/RegisteredGeneralPublic')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')

/*
* @route   POST api/registeredgeneralpublic/auth/login
* @desc    Login user
* @access  Public
*/

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const user = await RegisteredGeneralPublicUser.findOne({ email });
    if (!user) throw new BadRequest('User does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequest('Invalid credentials');

    const token = jwt.sign({ id: user._id, type: userType.GENERAL }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw new BadRequest('Couldn\'t sign the token');

    res.status(200).json({
        token,
        user: {
            id: user._id,
        },
        type: userType.GENERAL
    });
}));

/**
 * @route   POST api/registeredgeneralpublic/auth/register
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const user = await RegisteredGeneralPublicUser.findOne({ email });
        if (user) throw Error('User already exists');

        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');

        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong hashing the password');

        const newUser = new RegisteredGeneralPublicUser({
            firstName,
            lastName,
            email,
            password: hash
        });

        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');

        const token = jwt.sign({ id: savedUser._id, type: userType.GENERAL }, JWT_SECRET, {
            expiresIn: 3600
        });

        res.status(200).json({
            token,
            user: {
                id: user._id
            },
            type: userType.GENERAL
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

/**
 * @route   GET api/registeredgeneralpublic/auth/user
 * @desc    Check user valid
 * @access  Private
 */

router.get('/user', authMiddleware(userType.GENERAL), async (req, res) => {
    try {
        const user = await RegisteredGeneralPublicUser.findById(req.user.id).select('-password');
        if (!user) throw Error('User does not exist');
        res.json({id: user.id, type: userType.GENERAL});
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

module.exports = router;
