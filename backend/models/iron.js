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
        date:{ type: Date,default: new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })}
    }],
    consumedIronOrders:[{
        unitCostPerTon:{type: Number,default:0},
        consumedWeight:{type:Number,default:0},
        orderId:{type:String,default:""},
        date:{ type: Date,default: new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })}
    }]
});

const Iron = mongoose.model('Iron', IronSchema);

module.exports = Iron;
