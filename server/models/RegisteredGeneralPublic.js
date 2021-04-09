const mongoose = require('mongoose')
const extendSchema = require('mongoose-extend-schema');
const registeredUserSchema = require('./RegisteredUser');

// Create Schema
const RegisteredGeneralPublicSchema = extendSchema(registeredUserSchema, {

})

const RegisteredGeneralPublic = mongoose.model('RegisteredGeneralPublic', RegisteredGeneralPublicSchema);

module.exports = RegisteredGeneralPublic;