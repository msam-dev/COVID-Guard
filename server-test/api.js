process.env.NODE_ENV = 'testing';

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server/index");
const assert = require('chai').assert
// Configure chai
chai.use(chaiHttp);

describe("Covid App Server API", () => {
    describe("POST /api/registeredgeneralpublic/auth/login", () => {
        it("returns error message 'Please enter all fields'", (done) => {
            chai.request(app)
                .post('/api/registeredgeneralpublic/auth/login')
                .end((err, res) => {
                    if(err) throw new Error(err);
                    assert.property(res.body, 'msg');
                    done();
                });
        });
    });
});