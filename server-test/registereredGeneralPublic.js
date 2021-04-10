process.env.NODE_ENV = 'testing';
let mongoose = require("mongoose")
let RegisteredGeneralPublic = require('../server/models/RegisteredGeneralPublic');
let db = require("../server/db");

describe('RegisteredGeneralPublic', () => {
    beforeEach((done) => {
        db.connect().then(() => {done();});
    });
    describe('Add user', () => {
        it('it should add a Registered General Public User', (done) => {
            let user = new RegisteredGeneralPublic({
                email: "bill@billy.com",
                password: "fdfdfddf",
                firstName: "Bill",
                lastName: "Jones"
            });
            user.save(function (err) {
                if (err) return console.error(err);
                done();
            });
        });
    });
    afterEach((done) => {
        mongoose.connection.db.dropDatabase((err)=>{
            if(err) return console.error(err);
            done();
        });
    });
});
