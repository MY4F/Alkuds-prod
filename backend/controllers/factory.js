const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");

const getFactoryInfo = (req , res) => {
    let db = getDatabaseByName('Factory');
    res.json(db);

}
const addFactory = (req , res) => {
    const { name,address } = req.body

    let db = getDatabaseByName('Factory');
    console.log(db)
    db.push(
        {
            name,
            address,
            tickets:[]
        }
    )

    updateDatabaseByName("Factory",JSON.stringify(db));
    res.json({"msg":"success"})

}

module.exports = {
    addFactory , getFactoryInfo 
}