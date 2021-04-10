const mongoose = require('mongoose')

// Create Schema
const PositiveCaseSchema = new mongoose.Schema({
    testDate: {
        type: Date,
        required: true
    },
    // linked to RegisteredGeneralPublic or GeneralPublicUser (https://mongoosejs.com/docs/populate.html)
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
        // will look at the `onModel` property to find the right model.
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        required: true,
        enum: ['RegisteredGeneralPublic', 'GeneralPublicUser']
    }
});


const PositiveCase = mongoose.model('PositiveCase', PositiveCaseSchema);

module.exports = PositiveCase;