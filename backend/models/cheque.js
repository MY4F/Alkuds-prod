const mongoose = require('mongoose');
const ChequeSchema = new mongoose.Schema({
    Amount: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
    },
    isOpened: {
        type: Boolean,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    exchangeDate: {
        type: Date,
        required: true
    },
    clientId: {
        type: String,
        required: true
    }
});

const Cheque = mongoose.model('Cheque', ChequeSchema);

module.exports = Cheque;
