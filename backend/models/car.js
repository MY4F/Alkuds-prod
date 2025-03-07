const mongoose = require('mongoose');
const CarSchema = new mongoose.Schema({
    carNo: {
        type: String,
        required: true
    },
    lorryNo: {
        type: String,
        required: true
    }
});

const Car = mongoose.model('Car', CarSchema);

module.exports = Car;
