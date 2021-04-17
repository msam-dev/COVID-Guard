const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const PositiveCase = require("../../../models/PositiveCase");
const CheckIn = require("../../../models/CheckIn");
const {BadRequest} = require('../../../utils/errors');
const moment = require("moment");
const Business = require("../../../models/Business");
const GeneralPublic = require("../../../models/GeneralPublic");

// check vaccination code is valid and return
// endpoint /checkvaccinationisvalid
// return {success:true, vaccinationType, vaccinationStatus, dateAdministered, patientFirstName, patientLastName}


/**
 * @route   POST /api/generalpublic/currenthotspots
 * @desc    gets current virus hotspots
 * @access  Public
 */

router.get('/currenthotspots', asyncHandler(async (req, res) => {
    // do it the easiest way first then try aggregate
    let positiveCases = await PositiveCase.find();
    let positiveCheckInsAll = [];
    for(let positiveCase of positiveCases){
        let positiveCheckIns = await CheckIn.find({user: positiveCase.user, date: {$gt: moment().subtract(14, 'days').toDate()}});
        positiveCheckInsAll = positiveCheckInsAll.concat(positiveCheckIns);
    }
    let positiveBusinesses = {};
    for(let positiveCheckIn of positiveCheckInsAll){
        if(positiveBusinesses[positiveCheckIn.business.id] == undefined){
            positiveBusinesses[positiveCheckIn.business.id] = positiveCheckIn;
        } else if(positiveBusinesses[positiveCheckIn.business.id].date < positiveCheckIn.date){
            positiveBusinesses[positiveCheckIn.business.id] = positiveCheckIn;
        }
    }
    let hotspots = [];
    Object.keys(positiveBusinesses).map(function(key, index) {
        let business = positiveBusinesses[key].business;
        hotspots.push({
            venueName: business.name,
            ABN: business.ABN,
            city: business.address.city,
            state: business.address.state,
            postcode: business.address.postcode,
            addressLine1: business.address.addressLine1,
            addressLine2: business.address.addressLine2,
            dateMarked: positiveBusinesses[key].date
        });
    });

    res.status(200).json({
        success: true,
        hotspots
    });
}));

/**
 * @route   POST /api/generalpublic/checkin
 * @desc    performs a checkin for a general public user
 * @access  Public
 */

router.post('/checkin', asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, venueCode } = req.body;

    // Simple validation
    if (!firstName || !lastName || !email || !venueCode) {
        throw new BadRequest('Please enter all fields');
    }

    // Check for existing user
    const business = await Business.findOne({ code: venueCode });
    if (!business) throw new BadRequest('Business venue does not exist');

    let generalPublic = new GeneralPublic({firstName, lastName,email, phone});
    let savedGeneralPublic = await generalPublic.save();

    let checkIn = new CheckIn({user: savedGeneralPublic, userModel: "GeneralPublic", business: business});
    let savedCheckIn = await checkIn.save();

    res.status(200).json({
        success: true,
        venueCode: savedCheckIn.business.code
    });
}));

module.exports = router;