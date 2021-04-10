const mongoose = require('mongoose')

// Create Schema
const VaccinationCentreSchema = new mongoose.Schema({
    clinicName: {
        type : String,
        required: true
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
});


const VaccinationCentre = mongoose.model('VaccinationCentre', VaccinationCentreSchema);

module.exports = VaccinationCentre;