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
    },
    daysPositive: {
        type: Number,
        required: true
    }
});

autoPopulateField(PositiveCaseSchema, 'user');

PositiveCaseSchema.statics.sendEmailsToAffectedUsers = function(positiveCase){
    // Get positive checkin times
   PositiveCase.aggregate()
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
       dateVisited: { $dateToString: {date: "$checkin.date", format: "%Y-%m-%d"}}
         }).then((positiveCheckins)=>{
             for(let positiveCheckin of positiveCheckins){
                 CheckIn
                     .find({ $and: [
                         {business: {$eq:positiveCheckin.business}},
                        {$expr:
                                {$eq: [positiveCheckin.dateVisited, { $dateToString: {date: "$date", format: "%Y-%m-%d"}}]}}]})
                     .then((effectedCheckins)=>{
                         for(let effectedCheckin of effectedCheckins){
                             //Emailer.sendEmail
                             console.log(effectedCheckin);
                         }
                     });
             }
   });
;}

PositiveCaseSchema.post('insertMany', function(positiveCases, next ){
    positiveCases.map((positiveCase) => {
        PositiveCase.sendEmailsToAffectedUsers(positiveCase);
    });
    next();
});

PositiveCaseSchema.post('saved', function(positiveCase, next ){
    PositiveCase.sendEmailsToAffectedUsers(positiveCase);
    next();
});

const PositiveCase = mongoose.model('PositiveCase', PositiveCaseSchema);

module.exports = PositiveCase;