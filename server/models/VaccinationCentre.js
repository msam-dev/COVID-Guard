const mongoose = require('mongoose')

// Create Schema
const VaccinationCentreSchema = new mongoose.Schema({
    clinicName: {
        type : String,
        required: true
    }
    // needs link to address
});


const VaccinationCentre = mongoose.model('VaccinationCentre', VaccinationCentreSchema);

module.exports = VaccinationCentre;