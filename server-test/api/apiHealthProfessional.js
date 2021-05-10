process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const assert = require('chai').assert
const HealthProfessional = require("../../server/models/HealthProfessional");
const PositiveCase = require("../../server/models/PositiveCase");
const {createMockHealthProfessionalUsers} = require("../../server/utils/mockData");
const {createMockRegisteredGeneralPublicUsers} = require("../../server/utils/mockData");
const {createMockPositiveCases} = require("../../server/utils/mockData");
const {createMockVaccinationRecord} = require("../../server/utils/mockData");

// Configure chai
chai.use(chaiHttp);

describe("Covid App Server Health Professional Endpoints", () => {
    describe("GET /api/healthprofessional/profile", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .get('/api/healthprofessional/profile')
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
                .get('/api/healthprofessional/profile')
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
            let users = await createMockHealthProfessionalUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .get('/api/healthprofessional/profile')
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
    describe("POST /api/healthprofessional/profile", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/profile')
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
                .post('/api/healthprofessional/profile')
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
            let users = await createMockHealthProfessionalUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .post('/api/healthprofessional/profile')
                .send({
                    userId: user.id,
                    firstName: "Bob",
                    lastName: "Costas",
                    phone: "0405060607"
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
            assert.propertyVal(res.body, 'userId', user.id);
            let changedUser = await HealthProfessional.findById(user.id);
            assert.propertyVal(changedUser, "id", user.id);
            assert.propertyVal(changedUser, "firstName", "Bob");
            assert.propertyVal(changedUser, "lastName", "Costas");
            assert.propertyVal(changedUser, "phone", "0405060607");
        });
    });
    describe("POST /api/healthprofessional/markpatientpositive", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/markpatientpositive')
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
                .post('/api/healthprofessional/markpatientpositive')
                .send({
                    email:"Sienna_Hayes85@hotmail.com",
                    testDate:'02-02-2021',
                    daysPositive: 1
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
        it("marks user as positive case", async () => {
            let users = await createMockRegisteredGeneralPublicUsers(true);
            let user = users[0];

            const res = await chai.request(app)
                .post('/api/healthprofessional/markpatientpositive')
                .send({
                    email: user.email,
                    testDate:'02-02-2021',
                    daysPositive: 1
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
        });
    });
    describe("POST /api/healthprofessional/confirmpatientvaccinationinformation", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/confirmpatientvaccinationinformation')
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
        it("it returns error message 'Patient does not exist'", (done) => {
            chai.request(app)
                .post('/api/healthprofessional/confirmpatientvaccinationinformation')
                .send({
                    email:"Nicholas.Ritchie79@hotmail.com",
                    vaccinationType:"Novavax",
                    dateAdministered:'02-02-2021'
                })
                .then((res) => {
                    if (res.status === 500) throw new Error(res.body.message);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Patient does not exist');
                    done();
                }).catch((err) => {
                done(err);
            });
        });
        it("confirms user vaccination", async () => {
            let records = await createMockVaccinationRecord(true);
            let patients = await createMockPositiveCases(true);
            let patient = patients[0];
            console.log(patient);

            const res = await chai.request(app)
                .post('/api/healthprofessional/confirmpatientvaccinationinformation')
                .send({
                    email: patient.email,
                    vaccinationType: "Novavax",
                    dateAdministered: '02-02-2021'
                });
            assert.equal(res.status, 200);
            assert.propertyVal(res.body, 'success', true);
        });
    });
});