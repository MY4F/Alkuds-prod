const { updateDatabaseByName, getDatabaseByName } = require("./databaseController")
const Iron = require('../models/iron')
const addIron = async (req, res) => {
    const { name, weight, radius, cost } = req.body
    let newIron;
    try {
        newIron = await Iron.find(
            {
                $and: [
                    { "name": name },
                    { "radius": radius }
                ]
            }
        )
        if (newIron.length > 0) {
            let newCostPerWeightEntry = {
                cost, weight
            }
            let newObject = newIron[0]
            newObject.costPerWeight.push(newCostPerWeightEntry)
            console.log(newObject)
            newIron = await Iron.findOneAndUpdate({ "_id": newObject._id.toString() }, { $push: {"costPerWeight":newCostPerWeightEntry} } , { returnDocument: 'after' })
        }
        else {
            newIron = new Iron(
                {
                    name,
                    radius,
                    costPerWeight: [
                        {
                            cost,
                            weight
                        }
                    ]
                }
            )
            newIron.save()
        }
    }
    catch (err) {
        console.log(err)
    }

    res.json(newIron)
}

const addIronWeight = (req, res) => {

}

const subtractIronWeight = (req, res) => {

}

const getIronStorage = async(req, res) => {
    let ironList, ironMap = {};
    try {
        ironList = await Iron.find()
        for(let i of ironList){
            totalWeight = 0
            for(j of i["costPerWeight"]){
                totalWeight += j["weight"]
            }
            if(i.name in ironMap){
                ironMap[i.name].push({"radius":i["radius"],"weight":totalWeight})
            }
            else{
                ironMap[i.name] = [
                    {"radius":i["radius"],"weight":totalWeight}
                ]
            }
        }
        Object.keys(ironMap).forEach(key => {
            ironMap[key].sort((a, b) => Number(a.radius) - Number(b.radius));
        });
        const ironArray = Object.entries(ironMap).map(([key, value]) => ({ [key]: value }));
        res.json(ironArray)
    }
    catch(err){
        console.log(err)
    }
}
let x = 0;
const getScaleWeight = (req, res) => {
    res.json({ "weight": x })
    x += 1350;

    // driver name






    // let requestBody = req.body;
    // let data = getDatabaseByName('Tickets');
    // data.push(requestBody);
    // updateDatabaseByName('Tickets', JSON.stringify(data));
    // let iron = getDatabaseByName('IronStorage');
    // let todayDate = requestBody.date;
    // requestBody.reciept.map((el) => {
    //     iron.map((dataBaseIronel) => {
    //         if (requestBody.type == "in") {
    //             if (dataBaseIronel.name == el.ironName) {
    //                 dataBaseIronel.props.map((prop) => {
    //                     if (prop.radius == el.radius) {
    //                         prop.weight += el.weight;
    //                         prop.date = todayDate;
    //                     }
    //                 })
    //             }
    //         }
    //         if (requestBody.type == "out") {
    //             if (dataBaseIronel.name == el.ironName) {
    //                 dataBaseIronel.props.map((prop) => {
    //                     if (prop.radius == el.radius) {
    //                         prop.weight -= el.weight;
    //                         prop.date = todayDate;

    //                     }
    //                 })
    //             }
    //         }
    //     })

    // })
    // updateDatabaseByName('IronStorage', JSON.stringify(iron));



}

const changeIronWeight = (req, res) => {
    const { radius, name, weight } = req.body
    let db = getDatabaseByName('IronStorage');
    let isFound = false;
    for (let i in db) {
        if (name === db[i]['name']) {
            for (let j in db[i].props) {
                //console.log(radius,db[i]['props'][j].radius)
                if (radius == db[i]['props'][j].radius) {
                    db[i]["props"][j].weight += parseInt(weight)
                    console.log(db[i]["props"][j].weight)
                    console.log(db[i]["props"])
                    isFound = true;
                    updateDatabaseByName('IronStorage', JSON.stringify(db))
                    res.json({ "msg": "done", "newWeight": weight })
                    break;
                }
            }
        }

        if (isFound)
            break;
    }


}

const handleChangePassword = (req, res) => {
    let { password } = req.body;

    let db = getDatabaseByName('Passwords');

    if (db[0]["ironChangePassword"] === password) {
        res.json({ "msg": "success" })
    }
    else {
        res.json({ "msg": "failed" })
    }
}

module.exports = {
    getIronStorage,
    addIron,
    addIronWeight,
    subtractIronWeight,
    changeIronWeight,
    getScaleWeight,
    handleChangePassword
}