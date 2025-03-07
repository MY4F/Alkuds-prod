const mongoose = require('mongoose');
const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    ticketsIds:[],
    clientId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default:0
    },
    totalPrice: {
        type: Number,
        default:0
    },
    totalPaid: {
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
    }
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
