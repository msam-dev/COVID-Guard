const express = require('express')
const router = express.Router();
const VaccinationRecord = require('../../../models/VaccinationRecord')
const userType = require("../../../_constants/usertypes")

const asyncHandler = require('express-async-handler');
const PositiveCase = require("../../../models/PositiveCase");
const CheckIn = require("../../../models/CheckIn");
const {BadRequest} = require('../../../utils/errors');
const moment = require("moment");
const Business = require("../../../models/Business");
const GeneralPublic = require("../../../models/GeneralPublic");
const rp = require('request-promise');
const $ = require('cheerio');

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

/**
 * @route   POST /api/generalpublic/checkvaccinationisvalid
 * @desc    takes a vaccinationcode and returns if valid and other info
 * @access  Public
 */

router.post('/checkvaccinationisvalid', asyncHandler(async (req, res) => {
    const { vaccinationCode } = req.body;

    // Simple validation
    if (!vaccinationCode) {
        throw new BadRequest('Please enter vaccination code');
    }

    // Check for existing record
    const vaccinationRecord = await VaccinationRecord.findOne({ vaccinationCode });
    if (!vaccinationRecord) throw new BadRequest('Vaccination record does not exist');

    // Define return fields
    const vaccinationType = vaccinationRecord.vaccinationType;
    const vaccinationStatus = vaccinationRecord.vaccinationStatus;
    const dateAdministered = vaccinationRecord.dateAdministered;
    const patientFirstName = vaccinationRecord.patient.firstName;
    const patientLastName = vaccinationRecord.patient.lastName;
    //console.log(vaccinationType, vaccinationStatus, dateAdministered, patientFirstName, patientLastName);

    res.status(200).json({
        success: true,
        vaccinationType,
        vaccinationStatus,
        dateAdministered,
        patientFirstName,
        patientLastName
    });
}));

/**
 * @route   POST /api/generalpublic/vaccinationcentres
 * @desc    returns an array of vaccine centres
 * @access  Public
 */

router.get('/vaccinationcentres', asyncHandler(async (req, res) => {
    const vaccinationCentres = [];
    // add rest of logic
    res.status(200).json({
        success: true,
        vaccinationCentres
    });
}));

/**
 * @route   POST /api/generalpublic/homepagestats
 * @desc    returns an object of stats
 * @access  Public
 */
function convertToNumber(str) {
    return Number(str.replace(/,/g, ''))
}

function dailySummary(html, category){
    let cat = matchText($(html).find('table.DAILY-SUMMARY td.CATEGORY a'), category).parent().parent();
    return {
        total: () => {return convertToNumber(cat.find("td.TOTAL").text())},
        net: () => {return convertToNumber(cat.find("td.NET").text())}
    };
}

function matchText(selector, text){
    return selector.filter(function() {
        return $(this).text().trim() === text;
    });
}
router.get('/homepagestats', asyncHandler(async (req, res) => {
    const covidSummaryUrl = 'https://covidlive.com.au/australia';

    const covidSummaryHtml = await rp(covidSummaryUrl);
    const covidSummary = {};
    covidSummary["totalHospitalised"] = dailySummary(covidSummaryHtml, "Hospitalised").total();
    covidSummary["totalDeaths"] = dailySummary(covidSummaryHtml, "Deaths").total();
    covidSummary["totalActiveCases"] = dailySummary(covidSummaryHtml, "Active").total();
    covidSummary["totalTests"] = dailySummary(covidSummaryHtml, "Tests").total();
    covidSummary["totalTestsLast24Hours"] = dailySummary(covidSummaryHtml, "Tests").net();
    covidSummary["totalOverseasCasesLast24Hours"] = dailySummary(covidSummaryHtml, "Overseas").net();
    covidSummary["totalLocalCasesLast24Hours"] = dailySummary(covidSummaryHtml, "New Cases").total() - dailySummary(covidSummaryHtml, "Overseas").net();
    covidSummary["totalCases"] = dailySummary(covidSummaryHtml, "Cases").total();
    covidSummary["totalCheckins"] = 0;
    covidSummary["totalHotspots"] = 0;

    const vaccinationSummaryUrl = 'https://covidlive.com.au/report/vaccinations';
    const vaccinationSummaryHtml = await rp(vaccinationSummaryUrl)
    const vaccinationMap = {
        "QLD": "Queensland",
        "NSW": "NSW",
        "VIC": "Victoria",
        "TAS":"Tasmania",
        "SA": "SA",
        "WA": "WA",
        "ACT":"ACT",
        "NT":"NT",
        "Commonwealth":"Commonwealth",
        "GPClinic": "GP Clinics",
        "Australia":"Australia"
    };
    const vaccinationSummary = {};
    for(const loc in vaccinationMap){
        vaccinationSummary[`total${loc}Vaccinations`] = convertToNumber($(vaccinationSummaryHtml).find(`table.VACCINATIONS td.STATE:contains('${vaccinationMap[loc]}')`).parent().find("td.DOSES").text());
    }

    const stats = {
        "covidSummary": covidSummary,
        "vaccinationSummary": vaccinationSummary
    };
    // add rest of logic
    res.status(200).json({
        success: true,
        stats
    });
}));
module.exports = router;