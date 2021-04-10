const mongoose = require('mongoose')
const extendSchema = require('mongoose-extend-schema');
const registeredUserSchema = require('./RegisteredUser');

// Create Schema
const BusinessUserSchema = extendSchema(registeredUserSchema, {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
})

const BusinessUser = mongoose.model('BusinessUser', BusinessUserSchema);

module.exports = BusinessUser;