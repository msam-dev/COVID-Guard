process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const assert = require('chai').assert
const BusinessOwner = require("../../server/models/BusinessUser");
const {createMockBusinessUsers} = require("../../server/utils/mockData");
// Configure chai
chai.use(chaiHttp);

describe("Covid App Server Business Owner Endpoints", () => {
    describe("GET /api/businessowner/profile", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .get('/api/businessowner/profile')
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
                .get('/api/businessowner/profile')
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
            let users = await createMockBusinessUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .get('/api/businessowner/profile')
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
    describe("POST /api/businessowner/profile", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/profile')
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
                .post('/api/businessowner/profile')
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
            let users = await createMockBusinessUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .post('/api/businessowner/profile')
                .send({
                    userId: user.id,
                    firstName: "Bob",
                    lastName: "Costas",
                    phone: "0405060607"
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            assert.propertyVal(res.body, 'userId', user.id);
            let changedUser = await BusinessOwner.findById(user.id);
            assert.propertyVal(changedUser, "id", user.id);
            assert.propertyVal(changedUser, "firstName", "Bob");
            assert.propertyVal(changedUser, "lastName", "Costas");
            assert.propertyVal(changedUser, "phone", "0405060607");
        });
    });
    describe("POST /api/businessowner/venueinfo", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/venueinfo')
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
                .post('/api/businessowner/venueinfo')
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
        it("displays venue info", async () => {
            let users = await createMockBusinessUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .post('/api/businessowner/venueinfo')
                .send({
                    userId: user.id,
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            assert.propertyVal(res.body, 'businessName', user.business.name);
            assert.propertyVal(res.body, 'businessCode', user.business.code);
        });
    });
});