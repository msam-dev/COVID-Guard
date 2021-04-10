process.env.NODE_ENV = 'testing';

var chai  = require("chai");
var chaiHttp = require("chai-http");
var app = require("../server/index");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Covid App Server API", () => {
    describe("POST /api/login", () => {
        it("returns the message", (done) => {
            chai.request(app)
                .get('/api/login')
                .end((err, res) => {
                    res.body.should.be.a("object");
                    res.body.status.should.be.eq("logged in");
                    done();
                });
        });
    });
});