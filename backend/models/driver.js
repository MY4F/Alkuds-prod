const mongoose = require('mongoose');
const DriverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    }
});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = Driver;
