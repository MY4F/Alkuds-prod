const { getDatabaseByName } = require("./databaseController")
const Car = require('../models/car')
const getCarInfo = async (req, res) => {
    let cars;
    try{
        cars = await Car.find()
    }
    catch(err){
        console.log(err)
    }

    res.json(cars)
 }
const addCar = async (req, res) => {
    const {carNo, lorryNo} = req.body;
    console.log(carNo,lorryNo)
    let newCar
    try{
        newCar = new Car(
            {
                carNo,lorryNo
            }
        )
        newCar.save();
    }
    catch(err){
        console.log(err)
    }

    res.json(newCar)
 }

module.exports = {
    getCarInfo, addCar
}