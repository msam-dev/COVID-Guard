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
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredGeneralPublic' }
});


const VaccinationRecord = mongoose.model('VaccinationRecord', VaccinationRecordSchema);

module.exports = VaccinationRecord;