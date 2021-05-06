process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const assert = require('chai').assert
const RegisteredGeneralPublic = require("../../server/models/RegisteredGeneralPublic");
const USER_TYPE = require("../../server/_constants/usertypes");
const {createAuthToken} = require("../../server/utils/general");
const {createMockRegisteredGeneralPublicUsers} = require("../../server/utils/mockData");
const {createMockBusinesses} = require("../../server/utils/mockData");

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server Registered General Public Endpoints", () => {
    describe("POST /api/registeredgeneralpublic/checkin", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .set('x-auth-token', createAuthToken(null, USER_TYPE.GENERAL))
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter all fields');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("it returns error message 'Business venue does not exist'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .set('x-auth-token', createAuthToken("41224d776a326fb40f000001", USER_TYPE.GENERAL))
                .send({
                    venueCode: "thisisinvalid",
                    userId: "41224d776a326fb40f000001"
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Business venue does not exist');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("returns valid checkin", async () => {
            let businesses = await createMockBusinesses(true);
            let users = await createMockRegisteredGeneralPublicUsers(true);
            let business = businesses[0];
            let user = users[0];
            return chai.request(app)
                .post('/api/registeredgeneralpublic/checkin')
                .set('x-auth-token', createAuthToken(user.id, USER_TYPE.GENERAL))
                .send({
                    venueCode: business.code,
                    userId: user.id
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'venueCode', business.code);
                    assert.propertyVal(res.body, 'userId', user.id);
                });
            });
        });
    describe("GET /api/registeredgeneralpublic/profile", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .get('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', createAuthToken(null, USER_TYPE.GENERAL))
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter all fields');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("it returns error message 'User does not exist'", (done) => {
            chai.request(app)
                .get('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', createAuthToken("41224d776a326fb40f000001", USER_TYPE.GENERAL))
                .send({
                    userId: "41224d776a326fb40f000001"
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'User does not exist');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("returns user data", async () => {
            let users = await createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .get('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', createAuthToken(user.id, USER_TYPE.GENERAL))
                .send({
                    userId: user.id
                })
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            assert.propertyVal(res.body, "userId", user.id);
            assert.propertyVal(res.body, "firstName", user.firstName);
            assert.propertyVal(res.body, "lastName", user.lastName);
            assert.propertyVal(res.body, "phone", user.phone);
        });
    });
    describe("POST /api/registeredgeneralpublic/profile", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', createAuthToken(null, USER_TYPE.GENERAL))
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter all fields');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("it returns error message 'User does not exist'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', createAuthToken("41224d776a326fb40f000001", USER_TYPE.GENERAL))
                .send({
                    userId: "41224d776a326fb40f000001",
                    firstName: "Bob",
                    lastName: "Costas",
                    phone: "0405060607"
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'User does not exist');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("updates user data", async () => {
            let users = await createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .post('/api/registeredgeneralpublic/profile')
                .set('x-auth-token', createAuthToken(user.id, USER_TYPE.GENERAL))
                .send({
                    userId: user.id,
                    firstName: "Bob",
                    lastName: "Costas",
                    phone: "0405060607"
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            assert.propertyVal(res.body, 'userId', user.id);
            let changedUser = await RegisteredGeneralPublic.findById(user.id);
            assert.propertyVal(changedUser, "id", user.id);
            assert.propertyVal(changedUser, "firstName", "Bob");
            assert.propertyVal(changedUser, "lastName", "Costas");
            assert.propertyVal(changedUser, "phone", "0405060607");
        });
    });
});