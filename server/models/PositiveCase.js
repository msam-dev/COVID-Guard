const dateShortcode = require('date-shortcode')

const mongoose = require('mongoose')
const CheckIn = require("./CheckIn");
const {Emailer} = require("../utils/general");
const {autoPopulateField} = require("../utils/db");

// Create Schema
const PositiveCaseSchema = new mongoose.Schema({
    testDate: {
        type: Date,
        required: true
    },
    infectiousStartDate: {
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

PositiveCaseSchema.statics.sendEmailsToAffectedUsers = async function (positiveCase) {
    // Get positive checkin times
    let positiveCheckins = await PositiveCase.aggregate()
        .match({_id: positiveCase._id})
        .lookup({
            from: CheckIn.collection.name,
            let: {user1: "$user", userModel1: "$userModel"},
            pipeline: [
                {
                    $match:
                        {
                            $expr:
                                {
                                    $and:
                                        [
                                            {$eq: ["$user", "$$user1"]},
                                            {$eq: ["$userModel", "$$userModel1"]}
                                        ]
                                }
                        }
                },
            ],
            as: "checkin"
        })
        .unwind("$checkin")
        .match({
            $and: [
                {$expr: {$gte: ["$checkin.date", "$infectiousStartDate"]}},
                {$expr: {$lte: ["$checkin.date", "$testDate"]}},
            ],
        }).project({
            _id: 0,
            business: "$checkin.business",
            dateVisited: {$dateToString: {date: "$checkin.date", format: "%Y-%m-%d"}}
        }).exec();

    for (let positiveCheckin of positiveCheckins) {
        let affectedCheckins = await CheckIn
            .find({
                $and: [
                    {
                        $and: [
                            {user: {$ne: positiveCase.user}},
                            {userModel: {$ne: positiveCase.userModel}}
                        ]
                    },
                    {business: {$eq: positiveCheckin.business}},
                    {
                        $expr:
                            {$eq: [positiveCheckin.dateVisited, {$dateToString: {date: "$date", format: "%Y-%m-%d"}}]}
                    }]
            }).exec();
        for (let affectedCheckin of affectedCheckins) {
            let msg = {
                to: affectedCheckin.user.email, // Change to your recipient
                from: 'mr664@uowmail.edu.au', // Change to your verified sender
                subject: 'Contact tracing',
                html: `<strong>This message is to notify you that you visited a venue where a confirmed positive case visited on ${dateShortcode.parse('{YYYY-MM-DD}', affectedCheckin.date)}</strong>`,
            }
            await Emailer.sendEmail(msg);
            affectedCheckin.userNotified = true;
            let affectedCheckinSaved = await affectedCheckin.save();
            //console.log(affectedCheckinSaved);
        }
    }
}

PositiveCaseSchema.post('insertMany', async function (positiveCases) {
    positiveCases.map(async (positiveCase) => {
        await PositiveCase.sendEmailsToAffectedUsers(positiveCase);
    });
});

PositiveCaseSchema.post('save', async function (positiveCase) {
    await PositiveCase.sendEmailsToAffectedUsers(positiveCase);
});

const PositiveCase = mongoose.model('PositiveCase', PositiveCaseSchema);

module.exports = PositiveCase;