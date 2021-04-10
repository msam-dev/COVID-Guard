const mongoose = require("mongoose")
const db = require("../server/db");

module.exports = {
    mochaGlobalSetup: async () => {
        await db.connect();
    },
    mochaGlobalTeardown: async () => {
        await mongoose.connection.db.dropDatabase();
    }
};
