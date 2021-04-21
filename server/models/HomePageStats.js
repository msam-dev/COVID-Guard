const mongoose = require('mongoose')

// Create Schema
const HomePageStatsSchema = new mongoose.Schema({
        covidSummary: {
            totalHospitalised: {
                type: Number,
                required: true
            },
            totalDeaths: {
                type: Number,
                required: true
            },
            totalActiveCases: {
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
            totalLocalCasesLast24Hours: {
                type: Number,
                required: true
            },
            totalCases: {
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

const Address = mongoose.model('HomePageStats', HomePageStatsSchema);

module.exports = Address;