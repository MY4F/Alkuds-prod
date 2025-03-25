const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");
const Client = require('../models/client')
const getClientsInfo = async(req , res) => {
    let clients, clientsMap = {};
    try{
        clients = await Client.find({});
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
    const { name,address} = req.body
    let newClient;
    try{
        newClient = new Client(
            {
                name,
                address,
                ticketsIds:[],
                clientId:4
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
module.exports = {
    getClientsInfo , addClients , updateClientsInfo
}