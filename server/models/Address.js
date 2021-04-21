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
        required: true,
        enum: ["QLD", "NSW", "VIC", "TAS", "SA", "WA", "ACT", "NT"]
    },
    postcode: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{4}$/.test(v);
            },
            message: props => `${props.value} is not a postcode!`
        }
    },
    coordinates: { type: mongoose.Schema.Types.ObjectId, ref: 'Coordinates' }
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;