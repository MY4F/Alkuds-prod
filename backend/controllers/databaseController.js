const fs = require("fs");
const path = require("path");
const getDatabaseByName = (name) =>{
    const db = fs.readFileSync(path.join(__dirname,'..', 'Database', `${name}.json`));
    return JSON.parse(db);
}

const updateDatabaseByName = (name,updatedDb) =>{
    fs.writeFileSync(path.join(__dirname, '..','Database', `${name}.json`), updatedDb);
}

module.exports = {
    getDatabaseByName,
    updateDatabaseByName
}