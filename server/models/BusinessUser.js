const mongoose = require('mongoose')
const registeredUserSchema = require('./RegisteredUser');
const userTypes = require('../_constants/usertypes');
const {autoPopulateField} = require("../utils/db");
const bcrypt = require('bcryptjs');
console.log(registeredUserSchema);
// Create Schema
function extendSchema (Schema, definition, options) {
    let newSchema = new mongoose.Schema(
        Object.assign({}, Schema.obj, definition),
        options
    );
    newSchema.virtuals = Schema.virtuals;
    newSchema.methods = Schema.methods;
    return newSchema;
}

const BusinessUserSchema = extendSchema(registeredUserSchema, {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
});

autoPopulateField(BusinessUserSchema, 'business');

BusinessUserSchema.virtual('type').get(function () {
    return userTypes.BUSINESS;
});

const BusinessUser = mongoose.model('BusinessUser', BusinessUserSchema);

module.exports = BusinessUser;