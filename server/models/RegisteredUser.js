const {extendSchema} = require('../utils/db');
const userSchema = require('./User');
const bcrypt = require('bcryptjs');
const {encryptPassword} = require("../utils/general");

// Create Schema
const RegisteredUserSchema = extendSchema(userSchema, {
    password: {
        type: String,
        required: true,
        select: false,
        set: (p) => { return encryptPassword(p)}
    },
    passwordReset: {
        temporaryPassword: {
            type: String
        },
        expiry: {
            type: Date
        }
    }
})
// this is not persisted and is just used for testing
RegisteredUserSchema.virtual('rawPassword').get(function() {
    return this.rawPassword;
}).set(function(rPassword) {
    this.rawPassword = rPassword;
});

RegisteredUserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

RegisteredUserSchema.methods.compareTemporaryPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordReset.temporaryPassword);
};

RegisteredUserSchema.methods.compareTemporaryExpiry = function() {
    return Date.now() < this.temporaryPassword.expiry;
};

module.exports = RegisteredUserSchema;