const mongoose = require('mongoose')
const {autoPopulateField} = require("../utils/db");
const {generate5CharacterCode} = require("../utils/general");

// Create Schema
const BusinessSchema = new mongoose.Schema({
    ABN: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    // may caused a Exception if it is the same as others, that needs to be handled
    code: {
        type: String,
        default: generate5CharacterCode,
        unique: true
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true},
});

autoPopulateField(BusinessSchema, 'address');

const Business = mongoose.model('Business', BusinessSchema);

module.exports = Business;