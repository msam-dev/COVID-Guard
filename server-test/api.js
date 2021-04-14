process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server/index");
const assert = require('chai').assert
const {createMockRegisteredGeneralPublicUsers} = require('../server/CreateMockData')
// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API", () => {
    describe("Auth", () => {
        describe("POST /api/registeredgeneralpublic/auth/login", () => {
            it("returns error message 'Please enter all fields'", (done) => {
                chai.request(app)
                    .post('/api/registeredgeneralpublic/auth/login')
                    .end((err, res) => {
                        if (err) throw new Error(err);
                        assert.equal(res.status, 400);
                        assert.property(res.body, 'message');
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
                        assert.property(res.body, 'message');
                        assert.propertyVal(res.body, 'message', 'User does not exist');
                        done();
                    });
            });
        });
    });
});