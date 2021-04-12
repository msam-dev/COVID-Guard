process.env.NODE_ENV = 'testing';

var chai  = require("chai");
var chaiHttp = require("chai-http");
var app = require("../server/index");
var should  = require("should");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Covid App Server API", () => {
    describe("POST /api/login", () => {
        it("returns the message", (done) => {
            chai.request(app)
                .get('/api/login')
                .end((err, res) => {
                    if(err) throw new Error(err);
                    res.body.should.be.a("object");
                    res.body.should.be.eq("logged in");
                    done();
                });
        });
    });
});