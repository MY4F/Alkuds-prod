const Wallet = require('../models/wallet')
const Order = require('../models/order')
const Client = require('../models/client')

const addTransaction = async (req, res) => {
    const {amount, bankName, clientId, orderId, type, notes} = req.body
    console.log("Here")
    let newTransaction, transactionObj = {
        amount,bankName,clientId, orderId, type, notes
    } , orders, isDivided = [],amountProcessing = amount, statement, clientUpdate = null, updatedOrders=[];
    try{
        if(type == "out"){
            orders = await Order.find(
                {
                    $and: [
                        { clientId },
                        { "state": "جاري انتظار الدفع" },
                        {type : "out"}
                    ] 
                }   
            ).sort({ date: 1 });
            console.log(orders)
            for(let i of orders){
                let RemainingPrice = i.totalPrice - i.totalPaid
                if(amountProcessing == 0) break;
                if(RemainingPrice <= amountProcessing && RemainingPrice != 0){
                    isDivided.push(
                        {
                            amount: RemainingPrice,
                            orderId: i._id
                        }
                    )
                    amountProcessing = amountProcessing - RemainingPrice
                } 
            }
            transactionObj["isDivided"] = isDivided
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    bankName
                },
                {
                    $push: {
                        'transactions': transactionObj
                    },
                    $inc: { totalAmount: amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
            for(let i of newTransaction.transactions[newTransaction.transactions.length-1].isDivided){
                for(let j of orders){
                    if(i.orderId === j._id.toString()){
                        statement = await Order.findOneAndUpdate
                        (   
                            {
                                _id:i.orderId
                            },
                            {
                                $push: {
                                    'statement': 
                                        {
                                            "paidAmount":i.amount,
                                            "clientId": clientId,
                                            "bankName" : bankName,
                                            "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                                            "walletTransactionId" : newTransaction.transactions[newTransaction.transactions.length-1]._id.toString()
                                        }
                                },
                                $inc: {
                                    totalPaid: i.amount
                                },
                                state: ((j.totalPrice - j.totalPaid - i.amount) == 0)? "منتهي" : j.state
                            },
                            { 
                                returnDocument: 'after' 
                            } 
                        )
                        updatedOrders.push(statement)
                        break;
                    }
                }
            }
            if(amountProcessing>0){
                clientUpdate = await Client.findOneAndUpdate({clientId},
                    {
                        $inc: {
                            balance: amountProcessing
                    },
                    },
                    { 
                        returnDocument: 'after' 
                    } 
                )
            }
        }
    }
    catch(err){
        console.log(err)
    }
    let returnedObj = {
        bank: newTransaction,
        orders: updatedOrders,
        client: clientUpdate
    }
    res.json(returnedObj)
}

const addCompanyExpenses = async(req,res)=>{
    const {amount, bankName, clientId, notes, type} = req.body
    let clientUpdate, newTransaction, bankFactor = (type==="مدين")? 1 : -1 , clientFactor =  (type==="مدين") ? -1 : 1
    try{
        clientUpdate = await Client.findOneAndUpdate({ clientId },
            {
                $inc: {
                    balance: amount * clientFactor
                },
                $push: {
                    purchasingNotes: {
                        amount,
                        notes
                    }
                }
            },
            { 
                returnDocument: 'after' 
            } 
        )

        newTransaction = await Wallet.findOneAndUpdate(
            {
                bankName
            },
            {
                $push: {
                    'transactions': { 
                        amount, 
                        notes,
                        clientId 
                    }
                },
                $inc: { totalAmount: amount * bankFactor } 
            },
            {
                returnDocument: 'after'
            }
        )
    }
    catch(err){
        console.log(err)
    }
    let returnedObj = {
        bank: newTransaction,
        client: clientUpdate
    }
    res.json(returnedObj)
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
        await newBank.save().then(data =>{
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
    addBank,
    addCompanyExpenses
}