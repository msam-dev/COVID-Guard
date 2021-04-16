const mongoose = require('mongoose')
const {autoPopulateField} = require("../utils/db");

// Create Schema
const PositiveCaseSchema = new mongoose.Schema({
    testDate: {
        type: Date,
        required: true
    },
    // linked to RegisteredGeneralPublic or GeneralPublicUser (https://mongoosejs.com/docs/populate.html)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
        // will look at the `userModel` property to find the right model.
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        required: true,
        enum: ['RegisteredGeneralPublic', 'GeneralPublic']
    }
});

autoPopulateField(PositiveCaseSchema, 'user');

const PositiveCase = mongoose.model('PositiveCase', PositiveCaseSchema);

module.exports = PositiveCase;