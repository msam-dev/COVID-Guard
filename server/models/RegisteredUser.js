const {extendSchema} = require('../utils/db');
const userSchema = require('./User');
const bcrypt = require('bcryptjs');
const {encryptPassword} = require("../utils/general");
const faker = require("faker");
const moment = require('moment');

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
    return password == this.passwordReset.temporaryPassword;
};

RegisteredUserSchema.methods.isTemporaryExpiryValid = function() {
    if(!this.passwordReset || !this.passwordReset.expiry) return false;
    return moment().isBefore(this.passwordReset.expiry);
};

RegisteredUserSchema.methods.setTemporaryPassword = function() {
    const tempPass = faker.internet.password();
    this.passwordReset.temporaryPassword = tempPass;
    this.passwordReset.expiry = moment().add(1, "days");
};

module.exports = RegisteredUserSchema;