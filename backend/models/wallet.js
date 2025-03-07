const mongoose = require('mongoose');
const WalletSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true 
    },
    bankName: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        default: ""
    }
});

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;
