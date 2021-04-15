const bcrypt = require('bcryptjs');

async function encryptPassword(password)
{
    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error('Something went wrong hashing the password');
    return hash;
}

module.exports = encryptPassword;