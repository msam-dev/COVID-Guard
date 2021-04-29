const express = require('express')
const router = express.Router();
const VaccinationRecord = require("../../../models/VaccinationRecord")
const VaccinationCentre = require("../../../models/VaccinationCentre")

const asyncHandler = require('express-async-handler');
const PositiveCase = require("../../../models/PositiveCase");
const CheckIn = require("../../../models/CheckIn");
const {BadRequest} = require('../../../utils/errors');
const moment = require("moment");
const Business = require("../../../models/Business");
const GeneralPublic = require("../../../models/GeneralPublic");
const rp = require('request-promise');
const $ = require('cheerio');
const RegisteredGeneralPublic = require("../../../models/RegisteredGeneralPublic");
const {cache} = require("../../../middleware/cache");
const {convertToNumber} = require("../../../utils/general");

/**
 * @route   POST /api/generalpublic/currenthotspots
 * @desc    gets current virus hotspots
 * @access  Public
 */

async function getPositiveBusinesses(){
    const filter = {testDate: {$gte: moment().subtract(30, 'days').toDate()}};
    let docs = await PositiveCase.aggregate([
        { $match: filter },
        {
            $lookup:
                {
                    from: CheckIn.collection.name,
                    let: {user1: "$user", userModel1: "$userModel"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:
                                        {
                                            $and:
                                                [
                                                    {$eq: ["$user", "$$user1"]},
                                                    {$eq: ["$userModel", "$$userModel1"]}
                                                ]
                                        }
                                }
                        },
                    ],
                    as: "checkin"
                }
        },
        { $unwind : "$checkin" },
        { $match: {
                $and: [
                    {$expr:{$gte:["$checkin.date", "$infectiousStartDate"]}},
                    {$expr:{$lte:["$checkin.date", "$testDate"]}},
                ],
            }
        }
    ]);
    return docs;
}

async function getPositiveBusinessesCount(){
    const filter = {testDate: {$gte: moment().subtract(30, 'days').toDate()}};
    let docs = await PositiveCase.aggregate([
        { $match: filter },
        {
            $lookup:
                {
                    from: CheckIn.collection.name,
                    let: {user1: "$user", userModel1: "$userModel"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:
                                        {
                                            $and:
                                                [
                                                    {$eq: ["$user", "$$user1"]},
                                                    {$eq: ["$userModel", "$$userModel1"]}
                                                ]
                                        }
                                }
                        },
                    ],
                    as: "checkin"
                }
        },
        { $unwind : "$checkin" },
        { $match: {
                $and: [
                    {$expr:{$gte:["$checkin.date", "$infectiousStartDate"]}},
                    {$expr:{$lte:["$checkin.date", "$testDate"]}},
                ],
            }
        },
        {$group: {_id: "$checkin.business"}},
        {$group: {_id: null, count: {$sum: 1}}}
    ]);
    return docs[0].count;
}

router.get('/currenthotspots', cache(10), asyncHandler(async (req, res) => {
    // do it the easiest way first then try aggregate
    let positiveBusinesses = await getPositiveBusinesses();
    let hotspots = [];
    for (let business of positiveBusinesses){
        let positiveBusiness = await Business.findById(business.checkin.business);
        hotspots.push({
            venueName: positiveBusiness.name,
            abn: positiveBusiness.abn,
            city: positiveBusiness.address.city,
            state: positiveBusiness.address.state,
            postcode: positiveBusiness.address.postcode,
            addressLine1: positiveBusiness.address.addressLine1,
            addressLine2: positiveBusiness.address.addressLine2,
            date: business.checkin.date
        });
    }

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

router.get('/vaccinationcentres', cache(10), asyncHandler(async (req, res) => {
    const vaccinationCentre = await VaccinationCentre.find();
    const vaccinationCentres = [];

    // iterates through and pushes all vaccination centres to the return array
    vaccinationCentre.forEach(vaccinationCentre =>
        vaccinationCentres.push(
            {
                clinicName:vaccinationCentre.clinicName,
                phone:vaccinationCentre.phone,
                addressLine1:vaccinationCentre.address.addressLine1,
                addressLine2:vaccinationCentre.address.addressLine2,
                suburb:vaccinationCentre.address.suburb,
                city:vaccinationCentre.address.city,
                state:vaccinationCentre.address.state,
                postcode:vaccinationCentre.address.postcode
            }
        )
    );

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

router.get('/homepagestats', cache(10), asyncHandler(async (req, res) => {
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
    covidSummary["totalCheckins"] = await CheckIn.countDocuments();
    covidSummary["totalRegisteredGeneralPublicUsers"] = await RegisteredGeneralPublic.countDocuments();
    covidSummary["totalBusinesses"] = await Business.countDocuments();
    covidSummary["totalVaccinationRecords"] = await VaccinationRecord.countDocuments();
    covidSummary["totalVaccinationCentres"] = await VaccinationCentre.countDocuments();
    covidSummary["totalHotspots"] = await getPositiveBusinessesCount();

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