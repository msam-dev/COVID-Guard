const mongoose = require('mongoose')

// Create Schema
const LocationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});


const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;