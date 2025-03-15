const Wallet = require('../models/wallet')

const addTransaction = async (req, res) => {
    const {amount, bankName, clientId, orderId} = req.body
    let newTransaction
    try{
        newTransaction = new Wallet(
            {
                amount,bankName,clientId, orderId
            }
        )
        newTransaction.save()
    }
    catch(err){
        console.log(err)
    }
    res.json(newTransaction)
}

const getSpecificClientTransactions = async (req,res) =>{
    const { clientId  } = req.params
    let transactions = {}
    try{
        transactions = await Wallet.find({clientId})
        for(let i of transactions){
            transactions[i._id] = i
        }
    }
    catch(err){
        console.log(err)
    }
    res.json(transactions)
}

module.exports = {
    addTransaction,
    getSpecificClientTransactions
}