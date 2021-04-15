const mongoose = require('mongoose')

// Create Schema
const VaccinationRecordSchema = new mongoose.Schema({
    vaccinationCode: {
        type : String,
        required: true,
        default: mongoose.Types.ObjectId
    },
    vaccinationType: {
        type : String,
        required: true,
        enum: ["Novavax", "AstraZeneca", "Pfizer"]
    },
    vaccinationStatus: {
        type : String,
        required: true,
        enum: ["Partial", "Complete"]
    },
    dateAdministered: {
        type : Date,
        required: true
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredGeneralPublic' }
});


const VaccinationRecord = mongoose.model('VaccinationRecord', VaccinationRecordSchema);

module.exports = VaccinationRecord;