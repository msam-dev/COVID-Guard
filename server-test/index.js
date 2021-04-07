var chai  = require("chai");
var chaiHttp = require("chai-http");
var app = require("../server/index");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Covid App Server API", () => {
    describe("GET /", () => {
        it("returns the message", (done) => {
            chai.request(app)
                .get('/api')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});