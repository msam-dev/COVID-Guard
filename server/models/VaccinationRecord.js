const mongoose = require('mongoose')

// Create Schema
const VaccinationRecordSchema = new mongoose.Schema({
    vaccinationCode: {
        type : String,
        required: true
        // need to autogenerate this in model
    },
    vaccinationType: {
        type : String,
        required: true
    },
    vaccinationStatus: {
        type : String,
        required: true
    },
    dateAdministered: {
        type : Date,
        required: true
    }
    // needs link to RegisteredGeneralPublic
});


const VaccinationRecord = mongoose.model('VaccinationRecord', VaccinationRecordSchema);

module.exports = VaccinationRecord;