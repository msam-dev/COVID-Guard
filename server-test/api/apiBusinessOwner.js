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
        it("it returns error message 'User does not exist'", (done) => {
            chai.request(app)
                .get('/api/businessowner/profile')
                .send({
                    userId: "41224d776a326fb40f000001"
                })
                .end((err, res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'User does not exist');
                    done();
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
        });
    });
    describe("POST /api/businessowner/profile", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/profile')
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
        it("it returns error message 'User does not exist'", (done) => {
            chai.request(app)
                .post('/api/businessowner/profile')
                .send({
                    userId: "41224d776a326fb40f000001",
                    firstName: "Bob",
                    lastName: "Costas",
                    phone: "0405060607"
                })
                .end((err, res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'User does not exist');
                    done();
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
});