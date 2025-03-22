const Wallet = require('../models/wallet')

const addTransaction = async (req, res) => {
    const {amount, bankName, clientId, orderId, type} = req.body
    let newTransaction, transactionObj = {
        amount,bankName,clientId, orderId, type
    }
    try{
        newTransaction =  Wallet.findOneAndUpdate(
            {
                bankName
            },
            {
                $push: {
                    'transactions': transactionObj
                }
            }
        )
        newTransaction.save()
    }
    catch(err){
        console.log(err)
    }
    res.json(newTransaction)
}

const addBank = async(req,res) =>{
    let { bankName, totalAmount } = req.body;
    let newBank;
    try{
        newBank =  new Wallet(
            {
                totalAmount,
                bankName,
                transactions:[
                    {
                        clientId:1,
                        amount:1000000,
                        type:"in"
                    },
                    {
                        clientId:1,
                        amount:2000000,
                        type:"in"
                    },
                    {
                        clientId:1,
                        amount:10000000,
                        type:"in"
                    },
                    {
                        clientId:2,
                        amount:500000,
                        type:"in"
                    }
                ]
            }
        )
        await newBank.save().then(data=>{
            res.json(data)
        })
    }
    catch(err){
        console.log(err)
    }
   
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

const getTransactionsGroupedByBank = async(req,res) =>{
    let wallets, walletsObj = {}
    try{
        wallets = await Wallet.find();
        for(let i of wallets){
            walletsObj[i.bankName] = i
        }
    }
    catch(err){
        console.log(err)
    }
    res.json(walletsObj)
}

module.exports = {
    addTransaction,
    getSpecificClientTransactions,
    getTransactionsGroupedByBank,
    addBank
}