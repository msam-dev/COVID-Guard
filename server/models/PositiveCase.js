const mongoose = require('mongoose')

// Create Schema
const PositiveCaseSchema = new mongoose.Schema({
    testDate: {
        type: Date,
        required: true
    }
    // Need to link to RegisteredGeneralPublic or GeneralPublicUser
});


const PositiveCase = mongoose.model('PositiveCase', PositiveCaseSchema);

module.exports = PositiveCase;