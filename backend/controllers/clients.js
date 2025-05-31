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
        id = await User.findById('67e8754822c838b9188ccae0')
        newClient = new Client(
            {
                name,
                address,
                ticketsIds:[],
                clientId: id["ids"].toString(),
                isFactory:isFactory === 'مورد' ? true:false
            }
        )
        id.ids += 1
        await id.save()

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