const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    },
    drivers: [{
        name: { type: String, required: true },
        number: { type: String, required: true }
    }],
    clientName: {
        type: String,
        required: true
    },
    firstWeight:{
        weight: { type: Number, default: 0 },
        date: { type: String, default: "" }
    },
    deliveryFees: { type: Number, required: true },
    ticket: [{
        ironName: { type: String, required: true },
        radius: { type: Number, required: true },
        neededWeight: { type: Number, required: true },
        weightBefore: { type: Number, default: 0 },
        weightAfter: { type: Number, default: 0 },
        netWeight: { type: Number, default: 0 },
        unitPrice: { type: Number, default: 0  },
        totalPrice: { type: Number, default: 0 },
        realTotalPrice: { type: Number, default: 0 },
        usedUnitCostPerWeight: [{
            weight: { type: Number, default: 0 },
            cost: { type: Number, default: 0 },
            ironId: { type: String, default: 0 },
        }],
        totalCost: { type: Number, default: 0 },
        netWeightForProcessing: { type: Number, default: 0 },
        isProcessed: { type: Boolean, default: false },
        profit: { type: Number, default: 0 },
        date: { type: String, default: new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }) }
    }],
    statement: [{
        walletTransactionId:  { type: String, default:"" },
        paidAmount: { type: Number, required: true },
        bankName: { type: String, default:"" },
        clientId: { type: String, required: true },
        date: { type: String, default: new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }) }
    }],
    affectedOrders: [{
        orderId:  { type: String, required: true },
        paidAmount: { type: Number, required: true },
        previousState: { type: String, required: true },
        date: { type: String, default: new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }) }
    }],
    totalProfit: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    realTotalPrice: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    type: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    driverId: {
        type: String,
        required: false
    },
    carId: {
        type: String,
        required: false
    },
    date: {
        type: String,
        default: new Date().toLocaleString()
    },
    notes: {
        type: String,
        default: ""
    },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
