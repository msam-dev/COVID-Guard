const mongoose = require('mongoose')
const {extendSchema} = require('../utils/db');
const registeredUserSchema = require('./RegisteredUser');
const userTypes = require('../_constants/usertypes');

// Create Schema
const HealthProfessionalSchema = extendSchema(registeredUserSchema, {
    healthID: {type: String, required: true, unique: true}
});

HealthProfessionalSchema.virtual('type').get(function () {
    return userTypes.HEALTH;
});
const HealthProfessional = mongoose.model('HealthProfessional', HealthProfessionalSchema);

module.exports = HealthProfessional;