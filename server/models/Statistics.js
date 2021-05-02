const moment = require("moment");

const mongoose = require('mongoose')
const VaccinationRecord = require("./VaccinationRecord");
const RegisteredGeneralPublic = require("./RegisteredGeneralPublic");
const Address = require("./Address");
const CheckIn = require("./CheckIn");
const PositiveCase = require("./PositiveCase");
const BusinessUser = require("./BusinessUser");
const Business = require("./Business");
const VaccinationCentre = require("./VaccinationCentre");

// Create Schema
const StatisticsSchema = new mongoose.Schema({
        covidSummary: {
            // from scraped
            totalHospitalised: {
                type: Number,
                required: true
            },
            // from scraped
            totalDeaths: {
                type: Number,
                required: true
            },
            // from scraped
            totalTests: {
                type: Number,
                required: true
            },
            // from scraped
            totalTestsLast24Hours: {
                type: Number,
                required: true
            },
            // from scraped
            totalOverseasCasesLast24Hours: {
                type: Number,
                required: true
            },
            totalPositiveCases: {
                type: Number,
                required: true
            },
            totalPositiveCasesLast24Hours: {
                type: Number,
                required: true
            },
            totalPositiveCasesByMonth: [{
                month: Number,
                year: Number,
                positiveCases: Number
            }],
            totalCheckins: {
                type: Number,
                required: true
            },
            checkinsLast24Hours: {
                type: Number,
                required: true
            },
            totalCurrentHotspotVenues: {
                type: Number,
                required: true
            },
            totalBusinessRegistered: {
                type: Number,
                required: true
            },
            totalRegisteredGeneralPublicUsers: {
                type: Number,
                required: true
            },
            businessesByState: [{
                state: String,
                numberOfBusinesses: Number
            }],
            businessRegistrationsByMonth: [{
                month: String,
                year: Number,
                numberOfBusinesses: Number
            }],
            businessesByState: [{
                state: String,
                numberOfBusinesses: Number
            }],
            generalPublicUserRegistrationsByMonth: [{
                month: String,
                year: Number,
                numberOfUsers: Number
            }]
        },
        vaccinationSummary: {
            totalVaccinations: {
                type: Number,
                required: true
            },
            vaccinationsYesterday: {
                type: Number,
                required: true
            },
            vaccinationsByType: [{
                vaccinationType: String,
                numberOfVaccinations: String,
            }],
            vaccinationCentresByState: [{
                state: String,
                numberOfVaccinationCentres: Number,
            }],
            vaccinationsByStatus: [{
                status: String,
                numberOfVaccinations: Number,
            }]
        },
        checkins: {
            checkinsByMonth: [{year: Number, month: Number, numberOfCheckins: Number}],
            checkinsByUserType: [{userType: String, numberOfCheckins: Number}]
        }
    }
);

StatisticsSchema.statics.getVaccinationsByMonth = async function () {
    let docs = await VaccinationRecord.aggregate()
        .project({
                year: { $year: "$dateAdministered" },
                month: { $month: "$dateAdministered" }
        })
        .group({
                _id: { month: "$month", year: "$year" },
                numberOfVaccinations: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfVaccinations: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getCheckinByMonth = async function () {
    let docs = await CheckIn.aggregate()
        .project({
            year: { $year: "$date" },
            month: { $month: "$date" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfCheckins: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfCheckins: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getPositiveCasesByMonth = async function () {
    let docs = await PositiveCase.aggregate()
        .project({
            year: { $year: "$testDate" },
            month: { $month: "$testDate" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfPositiveCases: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfPositiveCases: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getGeneralPublicRegistrationsByMonth = async function () {
    let docs = await RegisteredGeneralPublic.aggregate()
        .project({
            year: { $year: "$registrationDate" },
            month: { $month: "$registrationDate" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfRegistrations: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfRegistrations: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getBusinessRegistrationsByMonth = async function () {
    let docs = await BusinessUser.aggregate()
        .project({
            year: { $year: "$registrationDate" },
            month: { $month: "$registrationDate" }
        })
        .group({
            _id: { month: "$month", year: "$year" },
            numberOfRegistrations: { $sum: 1 }
        })
        .project({
            year: "$_id.year",
            month: "$_id.month",
            numberOfRegistrations: 1,
            _id: 0
        })
        .exec();
    return docs;
};

StatisticsSchema.statics.getVaccinationCentresByState = async function () {
    let docs = await VaccinationCentre.aggregate()
        .lookup( {
            from: Address.collection.name,
            localField: "address",
            foreignField: "_id",
            as: "address"
         })
        .unwind("$address")
        .group({_id: "$address.state", count: { $sum: 1 }})
        .project({state: "$_id", count: 1, _id: 0})
        .exec();
    return docs;
};

StatisticsSchema.statics.getBusinessesByState = async function () {
    let docs = await Business.aggregate()
        .lookup( {
            from: Address.collection.name,
            localField: "address",
            foreignField: "_id",
            as: "address"
        })
        .unwind("$address")
        .group({_id: "$address.state", count: { $sum: 1 }})
        .project({state: "$_id", count: 1, _id: 0})
        .exec();
    return docs;
};

StatisticsSchema.statics.getPositiveBusinessesCheckinDates = async function(){
    return PositiveCase.aggregate()
        .match({testDate: {$gte: moment().subtract(14, 'days').toDate()}})
        .lookup({
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
        })
        .unwind("$checkin")
        .match({
            $and: [
                {$expr: {$gte: ["$checkin.date", "$infectiousStartDate"]}},
                {$expr: {$lte: ["$checkin.date", "$testDate"]}},
            ],
        })
        .project({
            _id: 0, business: "$checkin.business", dateVisited: "$checkin.date"
        });
};

const Statistics = mongoose.model('Statistics', StatisticsSchema);

module.exports = Statistics;