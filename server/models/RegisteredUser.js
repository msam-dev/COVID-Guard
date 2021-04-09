const extendSchema = require('mongoose-extend-schema');
const userSchema = require('./User');

// Create Schema
const RegisteredUserSchema = extendSchema(userSchema, {
    password: {
        type: String,
        required: true
    }
})

module.exports = RegisteredUserSchema;