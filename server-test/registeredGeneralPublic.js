process.env.NODE_ENV = 'testing';
const RegisteredGeneralPublic = require('../server/models/RegisteredGeneralPublic');
const assert = require('chai').assert

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
                    assert.isObject(rUser);
                    assert.equal(rUser.firstName,"Bill");
                    assert.equal(rUser.lastName,"Jones");
                    assert.equal(rUser.password,"fdfdfddf");
                    assert.equal(rUser.email,"bill@billy.com");
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
                        assert.isObject(rUser);
                        assert.equal(rUser.firstName,"John");
                        assert.equal(rUser.lastName,"Smith");
                        assert.equal(rUser.password,"password");
                        assert.equal(rUser.email,"different@email.com");
                        if (err) return console.error(err);
                        done();
                    });
                });
            });
        });
    });
});
