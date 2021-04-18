const {extendSchema} = require('../utils/db');
const userSchema = require('./User');
const bcrypt = require('bcryptjs');

// Create Schema
const RegisteredUserSchema = extendSchema(userSchema, {
    password: {
        type: String,
        required: true,
        select: false
    }
})
// this is not persisted and is just used for testing
RegisteredUserSchema.virtual('rawPassword').get(function() {
    return this.rawPassword;
}).set(function(rPassword) {
    this.rawPassword = rPassword;
});

RegisteredUserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = RegisteredUserSchema;