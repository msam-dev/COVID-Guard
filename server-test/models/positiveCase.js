const {createMockPositiveCases} = require("../../server/utils/mockData");
const {createMockCheckIns} = require("../../server/utils/mockData");
const {createMockGeneralPublicUsers} = require("../../server/utils/mockData");
const {createMockRegisteredGeneralPublicUsers} = require("../../server/utils/mockData");
const {createMockBusinesses} = require("../../server/utils/mockData");
process.env.NODE_ENV = 'testing';
const assert = require('chai').assert
const faker = require('faker/locale/en_AU');
const CheckIn = require("../../server/models/CheckIn");
const sinon = require("sinon");
const {Emailer} = require("../../server/utils/general");
const dateShortcode = require('date-shortcode')

const datesAreOnSameDay = (first, second) => {
    return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getUTCDate() === second.getUTCDate();
};

describe('PositiveCase', () => {
    describe('Mark affected users as notified', () => {
        it('it should mark affected users as notified', async () => {
            let emailerStub = sinon.stub(Emailer, 'sendEmail').callsFake((msg) => {
                return {}
            });
            let businesses = await createMockBusinesses(true);
            let business = businesses[0];
            let positiveTestDate = faker.date.recent(10);
            let registeredGeneralPublicUsers = await createMockRegisteredGeneralPublicUsers(true, 100);
            let generalPublicUsers = await createMockGeneralPublicUsers(true, 100);
            let checkins = [];
            for(let u of registeredGeneralPublicUsers){
                checkins = checkins.concat(await createMockCheckIns(true, 1, u, business, null, faker.date.recent(3, positiveTestDate)))
            }
            for(let u of generalPublicUsers){
                checkins = checkins.concat(await createMockCheckIns(true, 1, u, business,null, faker.date.recent(3, positiveTestDate)))
            }
            let positiveCases = await createMockPositiveCases(false, 1, registeredGeneralPublicUsers[0], null, positiveTestDate);
            let positiveCase = await positiveCases[0].save();
            let positiveCheckIn = checkins[0];
            for(let checkin of checkins){
                if((positiveCase.user.id !== checkin.user.id && positiveCase.userModel !== checkin.userModel) && checkin.date >= positiveCase.infectiousStartDate && checkin.date <= positiveCase.testDate && datesAreOnSameDay(checkin.date, positiveCheckIn.date) && checkin.business === positiveCheckIn.business){
                    let updatedCheckin = await CheckIn.findOne({_id: checkin._id}).exec();
                    assert.isTrue(updatedCheckin.userNotified);
                    sinon.assert.calledWithMatch(emailerStub, sinon.match({
                        to: updatedCheckin.user.email, // Change to your recipient
                        from: 'mr664@uowmail.edu.au', // Change to your verified sender
                        subject: 'Contact tracing',
                        html: `<strong>This message is to notify you that you visited a venue where a confirmed positive case visited on ${dateShortcode.parse('{YYYY-MM-DD}', updatedCheckin.date)}</strong>`,
                    }));
                }
            }
        });
    });
});
