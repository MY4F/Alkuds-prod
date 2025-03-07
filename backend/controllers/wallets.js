const { getDatabaseByName,updateDatabaseByName } = require("./databaseController")
const Wallet = require('../models/wallet')

const addTransaction = async (req, res) => {
    const {amount, bankName, clientId} = req.body
    let newTransaction
    try{
        newTransaction = new Wallet(
            {
                amount,bankName,clientId
            }
        )
        newTransaction.save()
    }
    catch(err){
        console.log(err)
    }
    res.json(newTransaction)
}

module.exports = {
    addTransaction
}