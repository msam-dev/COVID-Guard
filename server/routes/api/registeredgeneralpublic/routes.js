const express = require('express')
const router = express.Router();
const RegisteredGeneralPublicUser = require('../../../models/RegisteredGeneralPublic')
const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middleware/auth');
const userType = require("../../../_constants/usertypes")
const {BadRequest} = require('../../../utils/errors')
const asyncHandler = require('express-async-handler')
const encryptPassword = require("../../../utils/encryptPassword");
const bcrypt = require('bcryptjs');
const Business = require("../../../models/Business");
const CheckIn = require("../../../models/CheckIn");
const {Unauthorized} = require("../../../utils/errors");
const {ServerError} = require("../../../utils/errors");

/*
* @route   POST api/registeredgeneralpublic/checkin
* @desc    Performs a checkin for registered general public user
* @access  Private
*/

router.post('/checkin', authMiddleware(userType.GENERAL), asyncHandler(async (req, res) => {
    const { userId, venueCode } = req.body;

    // Simple validation
    if (!userId || !venueCode) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const business = await Business.findOne({ code: venueCode });
    if (!business) throw new BadRequest('Business venue does not exist');

    // Check for existing user
    const user = await RegisteredGeneralPublicUser.findOne({ _id: userId });
    if (!user) throw new BadRequest('User does not exist');

    const checkin = new CheckIn({business: business, user: user, userModel: user.constructor.modelName})
    let savedCheckin = await checkin.save();
    if(!savedCheckin) throw new ServerError("Error saving checkin");

    res.status(200).json({
        success: true,
        userId: user.id,
        venueCode
    });
}));

module.exports = router;