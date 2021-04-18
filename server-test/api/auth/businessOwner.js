process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../server");
const USER_TYPE = require("../../../server/_constants/usertypes");
const RegisteredGeneralPublic = require("../../../server/models/RegisteredGeneralPublic");
const {createMockHealthProfessionalUsers} = require("../../../server/utils/mockData");
const {createMockBusinessUsers} = require("../../../server/utils/mockData");
const assert = require('chai').assert
const bcrypt = require('bcryptjs');
const BusinessUser = require("../../../server/models/BusinessUser");
const HealthProfessionalUser = require("../../../server/models/HealthProfessional");
const {createMockRegisteredGeneralPublicUsers} = require('../../../server/utils/mockData')
// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API BusinessOwner Auth", () => {
    describe("POST /api/businessowner/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/login')
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
        it("it returns msg 'User does not exist'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/login')
                .send({"email": "test@test.com", "password": "pass"})
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
        it("it allows successful login", (done) => {
            createMockBusinessUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/businessowner/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .end((err, res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        if (err) throw new Error(err);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(res.body, 'type', USER_TYPE.BUSINESS);
                        assert.property(res.body, 'token');
                        // implement this later
                        // assert.propertyVal(res.body, 'token', '');
                        done();
                    });
            });
        })
    });
    describe("POST /api/businessowner/auth/register", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/register')
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
        it("Register new business", (done) => {
            let userData = {
                firstName: "Billy",
                lastName: "Jones",
                email: "billy.jones@gmail.com",
                password: "thisismypassword",
                phone: "056789993",
                ABN: "12123456728",
                businessName: "My Business",
                addressLine1: "Unit 1",
                addressLine2: "155 Musselbrook ave",
                suburb: "Smithville",
                city: "Sydney",
                state: "NSW",
                postcode: 2010
            };
            chai.request(app)
                .post('/api/businessowner/auth/register')
                .send(userData)
                .end((err, res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    if (err) throw new Error(err);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'type', USER_TYPE.BUSINESS);
                    assert.property(res.body, 'token');
                    BusinessUser.findOne({email: userData.email}).then((user) => {
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(user, 'firstName', userData.firstName);
                        assert.propertyVal(user, 'lastName', userData.lastName);
                        assert.propertyVal(user, 'phone', userData.phone);
                        assert.propertyVal(user.business, 'ABN', userData.ABN);
                        assert.propertyVal(user.business, 'name', userData.businessName);
                        assert.propertyVal(user.business.address, 'addressLine1', userData.addressLine1);
                        assert.propertyVal(user.business.address, 'addressLine2', userData.addressLine2);
                        assert.propertyVal(user.business.address, 'suburb', userData.suburb);
                        assert.propertyVal(user.business.address, 'city', userData.city);
                        assert.propertyVal(user.business.address, 'state', userData.state);
                        assert.propertyVal(user.business.address, 'postcode', userData.postcode);
                        bcrypt.compare(userData.password, user.password).then((v) => {
                            assert.isTrue(v);
                            done();
                        });
                    });
                });
        });
        ;
    });
    describe("POST /api/businessowner/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/changepassword')
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
        it("returns error message 'Password and confirm password do not match'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/changepassword')
                .send({
                    "userId": "41224d776a326fb40f000001",
                    "currentPassword": "oldPassword",
                    "newPassword": "newPassword",
                    "confirmPassword": "newPasswordDifferent",
                })
                .end((err, res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Password and confirm password do not match');
                    done();
                });
        });
        it("returns error message 'Current password doesn\'t match'", (done) => {
            createMockBusinessUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/businessowner/auth/changepassword')
                    .send({
                        "userId": user.id,
                        "currentPassword": "oldPassword",
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .end((err, res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        if (err) throw new Error(err);
                        assert.equal(res.status, 400);
                        assert.propertyVal(res.body, 'errCode', 400);
                        assert.propertyVal(res.body, 'success', false);
                        assert.propertyVal(res.body, 'message', 'Current password doesn\'t match');
                        done();
                    });
            });
        });
        it("It changes a BusinessUsers password", (done) => {
            createMockBusinessUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/businessowner/auth/changepassword')
                    .send({
                        "userId": user.id,
                        "currentPassword": user.rawPassword,
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .end((err, res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        if (err) throw new Error(err);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        BusinessUser.findOne({_id: user.id}).then((changedUser) => {
                            assert.propertyVal(res.body, 'userId', user.id);
                            bcrypt.compare("newPassword", changedUser.password).then((v) => {
                                assert.isTrue(v);
                                done();
                            });
                        });
                    });
            });
        });
    });
});