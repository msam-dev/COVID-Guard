const mongoose = require('mongoose')
const extendSchema = require('mongoose-extend-schema');
const registeredUserSchema = require('./RegisteredUser');
const userTypes = require('../_constants/usertypes');

// Create Schema
const BusinessUserSchema = extendSchema(registeredUserSchema, {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },

})

BusinessUserSchema.virtual('type').get(function () {
    return userTypes.BUSINESS;
});

const BusinessUser = mongoose.model('BusinessUser', BusinessUserSchema);

module.exports = BusinessUser;