const { getDatabaseByName,updateDatabaseByName } = require("./databaseController")

const getId = (req, res) => {
    let db = getDatabaseByName('TicketId');
    res.json(db);
 }
const addId = (req, res) => {
    const cr = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
    let db = getDatabaseByName('TicketId');
    
    while(true){
        let random = ''
        for (let i = 0;i< 10;i++){
            const rndIdx = Math.floor(Math.random() * cr.length);
            random += cr[rndIdx];
        }

        if(!(random in db)){
            db.push({"id":random})
            updateDatabaseByName("TicketId",JSON.stringify(db));
            return random
        }
    }

 }

module.exports = {
    getId, addId
}