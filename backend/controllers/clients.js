const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");
const Client = require('../models/client')
const User = require('../models/user')
const getClientsInfo = async(req , res) => {
    let clients, clientsMap = {};
    try{
        clients = await Client.find();
        for(x of clients){
            clientsMap[x.clientId] = x
        }
    }
    catch(err){
        console.log(err)
    }
    res.json(clientsMap)


}
const addClients = async (req , res) => {
    const { name,address, clientId, isFactory} = req.body
    let newClient, id;
    try{
        const latestDoc = await Client.find().sort({ _id: -1 }).limit(1)
        let newId = parseInt(latestDoc[0].clientId) + 1
        newClient = new Client(
            {
                name,
                address,
                ticketsIds:[],
                clientId: newId.toString(),
                isFactory:isFactory === 'مورد' ? true : isFactory === 'عميل و مورد' ? true : isFactory === 'عميل' ?false : true,
                isClient: isFactory === 'عميل' ? true: isFactory === 'عميل و مورد' ? true : isFactory === 'عميل' ?true : false
            }
        )
        newClient.save()
    }
    catch(err){
        console.log(err)
    }
    res.json(newClient)

}
const updateClientsInfo = (req , res) => {
    res.json( {
        clients : "info"
    })

}

const resetClients = async(req,res)=>{
    let result
    try{
          result = await Client.updateMany({},{balance:0 , "$set":{transactionsHistory:[], ticketsIds:[], purchasingNotes:[]}})
    }
    catch(err){
        console.log(err)
    }
    return result
}

const updateBalances = async(req,res) =>{
    const { balance } = req.body
    console.log(balance)
    let result
    try{
        for(const key in balance){
            const client = await Client.findOne({clientId: balance[key].clientId})
            if(client){
                client.balance = balance[key].balance
                await client.save()
            }
        }
        result = {message: "Balances updated successfully"}
    }
    catch(err){
        console.log(err)
        result = {message: "Error updating balances"}
    }
    return res.json(result)
}

module.exports = {
    getClientsInfo , addClients , updateClientsInfo, resetClients, updateBalances
}