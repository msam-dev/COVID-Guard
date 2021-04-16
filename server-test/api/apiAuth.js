process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const USER_TYPE = require("../../server/_constants/usertypes");
const RegisteredGeneralPublic = require("../../server/models/RegisteredGeneralPublic");
const {createMockHealthProfessionalUsers} = require("../../server/utils/mockData");
const {createMockBusinessUsers} = require("../../server/utils/mockData");
const assert = require('chai').assert
const bcrypt = require('bcryptjs');
const BusinessUser = require("../../server/models/BusinessUser");
const HealthProfessionalUser = require("../../server/models/HealthProfessional");
const {createMockRegisteredGeneralPublicUsers} = require('../../server/utils/mockData')
// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API Auth", () => {
    describe("POST /api/registeredgeneralpublic/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/login')
                .end((err, res) => {
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
                .post('/api/registeredgeneralpublic/auth/login')
                .send({"email": "test@test.com", "password": "pass"})
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'User does not exist');
                    done();
                });
        });
        it("it allows successful login", (done) => {
            createMockRegisteredGeneralPublicUsers(true).then((users)=>
            {
                let user = users[0];
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .end((err, res) => {
                        if (err) throw new Error(err);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                        assert.property(res.body, 'token');
                        // implement this later
                        // assert.propertyVal(res.body, 'token', '');
                        done();
                    });
            });
        });
    });
    describe("POST /api/registeredgeneralpublic/auth/register", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/register')
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter all fields');
                    done();
                });
        });
        it("Register new general public user (no phone)", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/register')
                .send({
                    "email": "test@email.com",
                    "password": "testPassword",
                    "firstName": "John",
                    "lastName": "Smith"
                })
                .end((err, res) => {
                    if (err) throw new Error(err);
                    RegisteredGeneralPublic.findOne({email: "test@email.com"}).then((user) =>{
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                        assert.property(res.body, 'token');
                        assert.propertyVal(user, 'firstName', "John");
                        assert.propertyVal(user, 'lastName', "Smith");
                        assert.propertyVal(user, 'phone', undefined);
                        bcrypt.compare("testPassword", user.password).then((v) => {
                            assert.isTrue(v);
                            done();
                        });
                    });
                });
        });
        it("Register new general public user (with phone)", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/register')
                .send({
                    "email": "test2@email.com",
                    "password": "testPassword2",
                    "firstName": "Johnny",
                    "lastName": "Smithy",
                    "phone": "0498709723",
                })
                .end((err, res) => {
                    if (err) throw new Error(err);
                    RegisteredGeneralPublic.findOne({email: "test2@email.com"}).then((user) =>{
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                        assert.property(res.body, 'token');
                        assert.propertyVal(user, 'firstName', "Johnny");
                        assert.propertyVal(user, 'lastName', "Smithy");
                        assert.propertyVal(user, 'phone', "0498709723");
                        bcrypt.compare("testPassword2", user.password).then((v) => {
                            assert.isTrue(v);
                            done();
                        });
                    });
                });
        });
    });
    describe("POST /api/registeredgeneralpublic/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/changepassword')
                .end((err, res) => {
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
                .post('/api/registeredgeneralpublic/auth/changepassword')
                .send({
                    "userId": "23242fdsfjsdjsfdsf",
                    "currentPassword": "oldPassword",
                    "newPassword": "newPassword",
                    "confirmPassword": "newPasswordDifferent",
                })
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Password and confirm password do not match');
                    done();
                });
        });
        it("returns error message 'Current password doesn\'t match'", (done) => {
            createMockRegisteredGeneralPublicUsers(true).then((users)=>
            {
                let user = users[0];
                chai.request(app)
                .post('/api/registeredgeneralpublic/auth/changepassword')
                .send({
                    "userId": user.id,
                    "currentPassword": "oldPassword",
                    "newPassword": "newPassword",
                    "confirmPassword": "newPassword"
                })
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Current password doesn\'t match');
                    done();
                });
            });
        });
        it("It changes a RegisteredGeneralPublicUsers password", (done) => {
            createMockRegisteredGeneralPublicUsers(true).then((users)=>
            {
                let user = users[0];
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/changepassword')
                    .send({
                        "userId": user.id,
                        "currentPassword": user.rawPassword,
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .end((err, res) => {
                        if (err) throw new Error(err);
                        RegisteredGeneralPublic.findOne({_id: user.id}).then((changedUser) =>{
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
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
    describe("POST /api/businessowner/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/login')
                .end((err, res) => {
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
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'User does not exist');
                    done();
                });
        });
        it("it allows successful login", (done) => {
            createMockBusinessUsers(true).then((users)=>
            {
                let user = users[0];
                chai.request(app)
                    .post('/api/businessowner/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .end((err, res) => {
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
    describe("POST /api/businessowner/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/businessowner/auth/changepassword')
                .end((err, res) => {
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
                    "userId": "23242fdsfjsdjsfdsf",
                    "currentPassword": "oldPassword",
                    "newPassword": "newPassword",
                    "confirmPassword": "newPasswordDifferent",
                })
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Password and confirm password do not match');
                    done();
                });
        });
        it("returns error message 'Current password doesn\'t match'", (done) => {
            createMockBusinessUsers(true).then((users)=>
            {
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
            createMockBusinessUsers(true).then((users)=>
            {
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
                        if (err) throw new Error(err);
                        BusinessUser.findOne({_id: user.id}).then((changedUser) =>{
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
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
    describe("POST /api/healthprofessional/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/login')
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter all fields');
                    done();
                });
        });
        it("it returns message 'User does not exist'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/login')
                .send({"email": "test@test.com", "password": "pass"})
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'User does not exist');
                    done();
                });
        });
        it("it allows successful login", (done) => {
            createMockHealthProfessionalUsers(true).then((users)=>
            {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .end((err, res) => {
                        if (err) throw new Error(err);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(res.body, 'type', USER_TYPE.HEALTH);
                        assert.property(res.body, 'token');
                        // implement this later
                        // assert.propertyVal(res.body, 'token', '');
                        done();
                    });
            });
        })
    });
    describe("POST /api/healthprofessional/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/changepassword')
                .end((err, res) => {
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
                .post('/api/healthprofessional/auth/changepassword')
                .send({
                    "userId": "23242fdsfjsdjsfdsf",
                    "currentPassword": "oldPassword",
                    "newPassword": "newPassword",
                    "confirmPassword": "newPasswordDifferent",
                })
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Password and confirm password do not match');
                    done();
                });
        });
        it("returns error message 'Current password doesn\'t match'", (done) => {
            createMockHealthProfessionalUsers(true).then((users)=>
            {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/changepassword')
                    .send({
                        "userId": user.id,
                        "currentPassword": "oldPassword",
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .end((err, res) => {
                        if (err) throw new Error(err);
                        assert.equal(res.status, 400);
                        assert.propertyVal(res.body, 'errCode', 400);
                        assert.propertyVal(res.body, 'success', false);
                        assert.propertyVal(res.body, 'message', 'Current password doesn\'t match');
                        done();
                    });
            });
        });
        it("It changes a HealthProfessionalUsers password", (done) => {
            createMockHealthProfessionalUsers(true).then((users)=>
            {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/changepassword')
                    .send({
                        "userId": user.id,
                        "currentPassword": user.rawPassword,
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .end((err, res) => {
                        if (err) throw new Error(err);
                        HealthProfessionalUser.findOne({_id: user.id}).then((changedUser) =>{
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
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