process.env.NODE_ENV = 'testing';
const RegisteredGeneralPublic = require('../server/models/RegisteredGeneralPublic');
const should = require("should");

describe('RegisteredGeneralPublic', () => {
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
                RegisteredGeneralPublic.findById(user._id, {}, {}, (err, rUser)=>{
                    rUser.firstName.should.equal("Bill");
                    rUser.lastName.should.equal("Jones");
                    rUser.password.should.equal("fdfdfddf");
                    rUser.email.should.equal("bill@billy.com");
                    if (err) return console.error(err);
                    done();
                });
            });
        });
    });
    describe('Edit user', () => {
        it('it should edit a Registered General Public User', (done) => {
            RegisteredGeneralPublic.findOne({}, function (err, user) {
                user.firstName = "John";
                user.lastName = "Smith";
                user.email = "different@email.com";
                user.password = "password";
                user.save(function (err) {
                    if (err) return console.error(err);
                    RegisteredGeneralPublic.findById(user._id, {}, {}, (err, rUser)=>{
                        rUser.firstName.should.equal("John");
                        rUser.lastName.should.equal("Smith");
                        rUser.email.should.equal("different@email.com");
                        rUser.password.should.equal("password");
                        if (err) return console.error(err);
                        done();
                    });
                });
            });
        });
    });
});
