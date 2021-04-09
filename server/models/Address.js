const mongoose = require('mongoose')

// Create Schema
const AddressSchema = new mongoose.Schema({
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    suburb: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postcode: {
        type: Number,
        required: true
    }
    // need to link to optional location
});


const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;