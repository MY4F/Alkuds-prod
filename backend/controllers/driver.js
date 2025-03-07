const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");
const Driver = require('../models/driver')
const getDriversInfo = async (req , res) => {
    let drivers
    try{
        drivers = await Driver.find();
    }
    catch(err){
        console.log(err)
    }

    res.json(drivers)
} 
const addDriver = async (req , res) => {
    const { name, mobile } = req.body
    let newDriver;
    try{
        newDriver = new Driver(
            {
                name,mobile
            }
        )

        newDriver.save()
    }
    catch(err){
        console.log(err)
    }

    res.json(newDriver)

}
module.exports = {
    getDriversInfo , addDriver 
}