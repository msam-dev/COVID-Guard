const mongoose = require('mongoose')

// Create Schema
const CheckInSchema = new mongoose.Schema({
    date: {
        type : Date,
        default: Date.now
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
        enum: ['RegisteredGeneralPublic', 'GeneralPublicUser']
    }
});


const CheckIn = mongoose.model('CheckIn', CheckInSchema);

module.exports = CheckIn;