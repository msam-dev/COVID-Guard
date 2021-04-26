process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../server");
const USER_TYPE = require("../../../server/_constants/usertypes");
const {createMockHealthProfessionalUsers} = require("../../../server/utils/mockData");
const assert = require('chai').assert
const bcrypt = require('bcryptjs');
const HealthProfessionalUser = require("../../../server/models/HealthProfessional");
const jwt = require('jsonwebtoken');
const config = require('config');
const {createAuthToken} = require("../../../server/utils/general");
const JWT_SECRET = config.get('JWT_SECRET');

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API Health Professional Auth", () => {
    describe("POST /api/healthprofessional/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/login')
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
        it("it returns message 'User does not exist'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/login')
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
            createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/login')
                    .send({"email": user.email, "password": user.rawPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.propertyVal(res.body, 'type', USER_TYPE.HEALTH);
                        assert.property(res.body, 'token');
                        let decoded = jwt.verify(res.body.token, JWT_SECRET);
                        assert.propertyVal(decoded, 'userId', user.id);
                        assert.propertyVal(decoded, 'userType', USER_TYPE.HEALTH);
                        done();
                    }).catch((err) => {
                    done(err);
                });
            }).catch((err) => {
                done(err);
            });
        });
        it("it allows successful temporary login", (done) => {
            createMockHealthProfessionalUsers(true).then(async (users) => {
                let user = users[0];
                user.setTemporaryPassword();
                const savedUser = await user.save();
                chai.request(app)
                    .post('/api/healthprofessional/auth/login')
                    .send({"email": savedUser.email, "password": savedUser.passwordReset.temporaryPassword})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        HealthProfessionalUser.findById(savedUser.id).then((uUser) => {
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
                            assert.propertyVal(res.body, 'userId', uUser.id);
                            assert.propertyVal(res.body, 'type', USER_TYPE.HEALTH);
                            assert.propertyVal(res.body, 'isTemporary', true);
                            assert.propertyVal(uUser.passwordReset, 'expiry', undefined);
                            assert.propertyVal(uUser.passwordReset, 'temporaryPassword', undefined);
                            assert.property(res.body, 'token');
                            let decoded = jwt.verify(res.body.token, JWT_SECRET);
                            assert.propertyVal(decoded, 'userId', user.id);
                            assert.propertyVal(decoded, 'userType', USER_TYPE.HEALTH);
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
    describe("POST /api/healthprofessional/auth/register", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/register')
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
        it("Registers new health professional user", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/register')
                .send({
                    "email": "test2@email.com",
                    "password": "testPassword2",
                    "firstName": "Johnny",
                    "lastName": "Smithy",
                    "phone": "0476898725",
                    "healthID": "5656565656565656"
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body, 'success', true);
                    assert.propertyVal(res.body, 'type', USER_TYPE.HEALTH);
                    HealthProfessionalUser.findOne({email: "test2@email.com"}).select("+password").then((user) => {
                        assert.propertyVal(res.body, 'userId', user.id);
                        assert.property(res.body, 'token');
                        assert.property(res.body, 'token');
                        let decoded = jwt.verify(res.body.token, JWT_SECRET);
                        assert.propertyVal(decoded, 'userId', user.id);
                        assert.propertyVal(decoded, 'userType', USER_TYPE.HEALTH);
                        assert.propertyVal(user, 'firstName', "Johnny");
                        assert.propertyVal(user, 'lastName', "Smithy");
                        assert.propertyVal(user, 'phone', "0476898725");
                        assert.isTrue(user.comparePassword("testPassword2"));
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                }).catch((err) => {
                done(err);
            });
        });
    });
    describe("POST /api/healthprofessional/auth/changepassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/changepassword')
                .set('x-auth-token', createAuthToken(null, USER_TYPE.HEALTH))
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
                .post('/api/healthprofessional/auth/changepassword')
                .set('x-auth-token', createAuthToken("41224d776a326fb40f000001", USER_TYPE.HEALTH))
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
            createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/changepassword')
                    .set('x-auth-token', createAuthToken(user.id, USER_TYPE.HEALTH))
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
            }).catch((err) => {
                done(err);
            });
        });
        it("It changes a HealthProfessionalUsers password", (done) => {
            createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                chai.request(app)
                    .post('/api/healthprofessional/auth/changepassword')
                    .set('x-auth-token', createAuthToken(user.id, USER_TYPE.HEALTH))
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
                        HealthProfessionalUser.findById(user.id).select("+password").then((changedUser) => {
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
            }).catch((err) => {
                done(err);
            });
        });
    });
    describe("POST /api/healthprofessional/auth/forgotpassword", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/auth/forgotpassword')
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
            createMockHealthProfessionalUsers(true).then((users) => {
                let user = users[0];
                // reset the history so that you get the correct call
                global.setApiKeyStub.resetHistory();
                global.sendMailStub.resetHistory();
                chai.request(app)
                    .post('/api/healthprofessional/auth/forgotpassword')
                    .send({email: user.email})
                    .then((res) => {
                        if (res.status === 500) throw new Error(res.body.message);
                        assert.equal(res.status, 200);
                        assert.propertyVal(res.body, 'success', true);
                        assert.isTrue(global.setApiKeyStub.called);
                        assert.isTrue(global.sendMailStub.called);
                        HealthProfessionalUser.findById(user.id).then((changedUser) => {
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
            }).catch((err) => {
                done(err);
            });
        });
    })
});