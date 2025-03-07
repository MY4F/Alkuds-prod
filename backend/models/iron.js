const mongoose = require('mongoose');
const IronSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    radius: {
        type: String,
        required: true
    },
    costPerWeight:[{
        unitCostPerTon:{type: Number,default:0},
        weight:{type:Number,default:0},
        date:{ type: Date,default: Date.now}
    }]
});

const Iron = mongoose.model('Iron', IronSchema);

module.exports = Iron;
