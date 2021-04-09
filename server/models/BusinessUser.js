const mongoose = require('mongoose')
const extendSchema = require('mongoose-extend-schema');
const registeredUserSchema = require('./RegisteredUser');

// Create Schema
const BusinessUserSchema = extendSchema(registeredUserSchema, {
    // need to link to business
})

const BusinessUser = mongoose.model('BusinessUser', BusinessUserSchema);

module.exports = BusinessUser;