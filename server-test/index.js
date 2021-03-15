var expect  = require("chai").expect;
var request = require("request");

describe("Covid App Server API", function() {
        var url = "http://localhost:5000/api";

        it("returns status 200", function() {
            request(url, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });

        it("returns the message", function() {
            request(url, function(error, response, body) {
                expect(body).to.equal("{\"message\":\"Hello from the covid19-app server!\"}");
            });
        });
});
