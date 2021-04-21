process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../server");
const USER_TYPE = require("../../../server/_constants/usertypes");
const RegisteredGeneralPublic = require("../../../server/models/RegisteredGeneralPublic");
const assert = require('chai').assert
const bcrypt = require('bcryptjs');
const {createMockRegisteredGeneralPublicUsers} = require('../../../server/utils/mockData');

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API Registered General Public Auth", () => {
    describe("POST /api/registeredgeneralpublic/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/login')
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
        it("it returns msg 'User does not exist'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/login')
                .send({"email": "test@test.com", "password": "pass"})
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
        it("it allows successful login", (done) => {
            createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                        assert.propertyVal(res.body, 'isTemporary', false);
                        assert.property(res.body, 'token');
                        // implement this later
                        // assert.propertyVal(res.body, 'token', '');
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
        it("it allows successful temporary login", (done) => {
            createMockRegisteredGeneralPublicUsers(true).then(async (users) => {
                let user = users[0];
                user.setTemporaryPassword();
                const savedUser = await user.save();
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/login')
                    .send({"email": savedUser.email, "password": savedUser.passwordReset.temporaryPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'userId', savedUser.id);
                        assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                        assert.propertyVal(res.body, 'isTemporary', true);
                        assert.property(res.body, 'token');
                        // implement this later
                        // assert.propertyVal(res.body, 'token', '');
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
    });
    describe("POST /api/registeredgeneralpublic/auth/register", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/register')
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
        it("Register new general public user", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/register')
                .send({
                    "email": "test2@email.com",
                    "password": "testPassword2",
                    "firstName": "Johnny",
                    "lastName": "Smithy",
                    "phone": "0498709723",
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'type', USER_TYPE.GENERAL);
                    assert.property(res.body, 'token');
                    RegisteredGeneralPublic.findOne({email: "test2@email.com"}).select("+password").then((user) => {
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(user, 'firstName', "Johnny");
                        assert.propertyVal(user, 'lastName', "Smithy");
                        assert.propertyVal(user, 'phone', "0498709723");
                        user.comparePassword("testPassword2");
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                }).catch((err) => {
                done(err);
            });
        });
    });
    describe("POST /api/registeredgeneralpublic/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/changepassword')
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
        it("returns error message 'Password and confirm password do not match'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/changepassword')
                .send({
                    "userId": "41224d776a326fb40f000001",
                    "currentPassword": "oldPassword",
                    "newPassword": "newPassword",
                    "confirmPassword": "newPasswordDifferent",
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Password and confirm password do not match');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("returns error message 'Current password doesn\'t match'", (done) => {
            createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/changepassword')
                    .send({
                        "userId": user.id,
                        "currentPassword": "oldPassword",
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 400);
                        assert.propertyVal(res.body, 'errCode', 400);
                        assert.propertyVal(res.body, 'success', false);
                        assert.propertyVal(res.body, 'message', 'Current password doesn\'t match');
                        done();
                    }).catch((err) => {
                    done(err);
                });
            });
        });
        it("It changes a RegisteredGeneralPublicUsers password", (done) => {
            createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/changepassword')
                    .send({
                        "userId": user.id,
                        "currentPassword": user.rawPassword,
                        "newPassword": "newPassword",
                        "confirmPassword": "newPassword"
                    })
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        RegisteredGeneralPublic.findById(user.id).select("+password").then((changedUser) => {
                            assert.propertyVal(res.body, 'userId', user.id);
                            bcrypt.compare("newPassword", changedUser.password).then((v) => {
                                assert.isTrue(v);
                                done();
                            }).catch((err) => {
                                done(err);
                            });
                        }).catch((err) => {
                            done(err);
                        });
                    }).catch((err) => {
                    done(err);
                });
            });
        });
    });
    describe("POST /api/registeredgeneralpublic/auth/forgotpassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/forgotpassword')
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
        it("It creates a password reset request", (done) => {
            createMockRegisteredGeneralPublicUsers(true).then((users) => {
                let user = users[0];
                // reset the history so that you get the correct call
                global.setApiKeyStub.resetHistory();
                global.sendMailStub.resetHistory();
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/forgotpassword')
                    .send({email: user.email})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.isTrue(global.setApiKeyStub.called);
                        assert.isTrue(global.sendMailStub.called);
                        RegisteredGeneralPublic.findById(user.id).then((changedUser) => {
                            assert.propertyVal(res.body, 'userId', changedUser.id);
                            assert.notEqual(global.sendMailStub.getCall(0).args[0]["html"].indexOf(changedUser.passwordReset.temporaryPassword), -1);
                            assert.property(changedUser.passwordReset, 'temporaryPassword');
                            assert.property(changedUser.passwordReset, 'expiry');
                            done();
                        }).catch((err) => {
                            done(err);
                        });
                    }).catch((err) => {
                    done(err);
                });
            });
        });
    });
});