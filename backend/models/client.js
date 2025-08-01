const mongoose = require('mongoose');
const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isClient: {
        type: Boolean,
        default: true
    },
    address: {
        type: String,
        required: true
    },
    ticketsIds:[],
    purchasingNotes: [{
        amount: { type: Number, required: true },
        type: {type: String, default:""},
        notes: {type: String, default: "لا يوجد ملاحظات"},
        date : { type: String, default: new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })}
    }],
    transactionsHistory: [{
        amount: { type: Number, required: true },
        type: {type: String, default:""},
        date : { type: String, default: new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })}
    }],
    clientId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default:0
    },
    isDebtor: {
        type: Boolean,
        default:false
    },
    isFactory: {
        type: Boolean,
        default:false
    },
    isKudsPersonnel: {
        type: Boolean,
        default:false
    }
    

});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
