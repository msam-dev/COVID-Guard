const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const PositiveCase = require("../../../models/PositiveCase");
const CheckIn = require("../../../models/CheckIn");
const {BadRequest} = require('../../../utils/errors');
const moment = require("moment");

// check vaccination code is valid and return
// endpoint /checkvaccinationisvalid
// return {success:true, vaccinationType, vaccinationStatus, dateAdministered, patientFirstName, patientLastName}


/**
 * @route   POST /api/generalpublic/virusbreakouts
 * @desc    gets current virus breakouts
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

module.exports = router;