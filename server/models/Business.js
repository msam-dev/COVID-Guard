const mongoose = require('mongoose')
const {generateBusinessCode} = require("../utils/generateBusinessCode");

// Create Schema
const BusinessSchema = new mongoose.Schema({
    ABN: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // may caused a Exception if it is the same as others, that needs to be handled
    code: {
        type: String,
        default: generateBusinessCode,
        unique: true
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true},
});


const Business = mongoose.model('Business', BusinessSchema);

module.exports = Business;