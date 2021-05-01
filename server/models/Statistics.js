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
            totalHospitalised: {
                type: Number,
                required: true
            },
            totalDeaths: {
                type: Number,
                required: true
            },
            totalTests: {
                type: Number,
                required: true
            },
            totalTestsLast24Hours: {
                type: Number,
                required: true
            },
            totalOverseasCasesLast24Hours: {
                type: Number,
                required: true
            },
            totalCheckins: {
                type: Number,
                required: true
            },
            totalHotspots: {
                type: Number,
                required: true
            }
        },
        vaccinationSummary: {
            totalQLDVaccinations: {
                type: Number,
                required: true
            },
            totalNSWVaccinations: {
                type: Number,
                required: true
            },
            totalVICVaccinations: {
                type: Number,
                required: true
            },
            totalTASVaccinations: {
                type: Number,
                required: true
            },
            totalSAVaccinations: {
                type: Number,
                required: true
            },
            totalWAVaccinations: {
                type: Number,
                required: true
            },
            totalACTVaccinations: {
                type: Number,
                required: true
            },
            totalNTVaccinations: {
                type: Number,
                required: true
            },
            totalCommonwealthVaccinations: {
                type: Number,
                required: true
            },
            totalGPClinicVaccinations: {
                type: Number,
                required: true
            },
            totalAustraliaVaccinations: {
                type: Number,
                required: true
            }
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