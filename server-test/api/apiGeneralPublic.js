process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const USER_TYPE = require("../../server/_constants/usertypes");
const {createMockVaccinationRecord} = require("../../server/utils/mockData");
const assert = require('chai').assert
// Configure chai
chai.use(chaiHttp);

describe("Covid App Server General Public Endpoints", () => {
    describe("POST /api/generalpublic/checkvaccinationisvalid", () => {
        it("returns error message 'Please enter vaccination code'", (done) => {
            chai.request(app)
                .post('/api/generalpublic/checkvaccinationisvalid')
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Please enter vaccination code');
                    done();
                });
        });
        it("it returns error message 'Vaccination record does not exist'", (done) => {
            chai.request(app)
                .post('/api/generalpublic/checkvaccinationisvalid')
                .send({"vaccinationCode": "thisisinvalid"})
                .end((err, res) => {
                    if (err) throw new Error(err);
                    assert.equal(res.status, 400);
                    assert.propertyVal(res.body, 'errCode', 400);
                    assert.propertyVal(res.body, 'success', false);
                    assert.propertyVal(res.body, 'message', 'Vaccination record does not exist');
                    done();
                });
        });
        it("returns valid vaccination record", (done) => {
            createMockVaccinationRecord(true).then((vaccinationRecords)=>
                {
                    let vaccinationRecord = vaccinationRecords[0];
                    vaccinationRecord.populate("patient", "firstName lastName").execPopulate().then(function () {
                        chai.request(app)
                        .post('/api/generalpublic/checkvaccinationisvalid')
                        .send({"vaccinationCode": vaccinationRecord.vaccinationCode})
                        .end((err, res) => {
                            if (err) throw new Error(err);
                            assert.equal(res.status, 200);
                            assert.propertyVal(res.body, 'success', true);
                            assert.propertyVal(res.body, 'vaccinationType', vaccinationRecord.vaccinationType);
                            assert.propertyVal(res.body, 'vaccinationStatus', vaccinationRecord.vaccinationStatus);
                            assert.propertyVal(res.body, 'dateAdministered', vaccinationRecord.dateAdministered);
                            assert.propertyVal(res.body, 'patientFirstName', vaccinationRecord.patient.firstName);
                            assert.propertyVal(res.body, 'patientLastName', vaccinationRecord.patient.lastName);
                            done();
                        });
                    });
                });
        });
    });
});