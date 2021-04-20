const bcrypt = require('bcryptjs');

function convertToNumber(str) {
    return Number(str.replace(/,/g, ''))
}

function generate5CharacterCode(){
    return getRandomInt(1679616, 60466176).toString(36).toUpperCase()
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function encryptPassword(password)
{
    const salt = bcrypt.genSaltSync(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = bcrypt.hashSync(password, salt);
    if (!hash) throw Error('Something went wrong hashing the password');
    return hash;
}

module.exports = {convertToNumber, generate5CharacterCode, encryptPassword};