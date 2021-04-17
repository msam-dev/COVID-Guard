const mongoose = require('mongoose')
const {autoPopulateField} = require("../utils/db");

// Create Schema
const VaccinationCentreSchema = new mongoose.Schema({
    clinicName: {
        type : String,
        required: true
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    phone: {
        type : String,
        required: true
    }
});

autoPopulateField(VaccinationCentreSchema, 'address');

const VaccinationCentre = mongoose.model('VaccinationCentre', VaccinationCentreSchema);

module.exports = VaccinationCentre;