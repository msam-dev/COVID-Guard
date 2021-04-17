process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const USER_TYPE = require("../../server/_constants/usertypes");
const {createMockPositiveCases} = require("../../server/utils/mockData");
const {createMockCheckIns} = require("../../server/utils/mockData");
const {createMockVaccinationRecord} = require("../../server/utils/mockData");
const assert = require('chai').assert
const moment = require('moment');
const {createMockRegisteredGeneralPublicUsers} = require("../../server/utils/mockData");
const {createMockBusinesses} = require("../../server/utils/mockData");
const {createMockBusinessUsers} = require("../../server/utils/mockData");
// Configure chai
chai.use(chaiHttp);

describe("Covid App Server Registered General Public Endpoints", () => {
    describe("POST /api/registeredgeneralpublic/checkin", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .end((err, res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter all fields');
                    done();
                });
        });
        it("it returns error message 'Business venue does not exist'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .send({
                    venueCode: "thisisinvalid",
                    userId: "userId"
                })
                .end((err, res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Business venue does not exist');
                    done();
                });
        });
        it("returns valid checkin", async () => {
            let businesses = await createMockBusinesses(true);
            let users = await createMockRegisteredGeneralPublicUsers(true);
            let business = businesses[0];
            let user = users[0];

            chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .send({
                    venueCode: business.code,
                    userId: user.id
                })
                .end((err, res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    if (err) throw new Error(err);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'venueCode', business.code);
                    assert.propertyVal(res.body, 'userId', user.id);
                });
            });
        });
    });