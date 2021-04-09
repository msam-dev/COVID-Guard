const mongoose = require('mongoose')
const extendSchema = require('mongoose-extend-schema');
const registeredUserSchema = require('./RegisteredUser');

// Create Schema
const HealthProfessionalSchema = extendSchema(registeredUserSchema, {
    healthID: {type: String, required: true}
})

const HealthProfessional = mongoose.model('HealthProfessional', HealthProfessionalSchema);

module.exports = HealthProfessional;