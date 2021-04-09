const mongoose = require('mongoose')

// Create Schema
const CheckInSchema = new mongoose.Schema({
    date: {
        type : Date,
        default: Date.now
    }
    // needs to be linked to RegisteredGeneralPublic or GeneralPublicUser
});


const CheckIn = mongoose.model('CheckIn', CheckInSchema);

module.exports = CheckIn;