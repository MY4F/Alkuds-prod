const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { resetClients } = require('../controllers/clients');
const { resetAllIronArray } = require('../controllers/irons');
const { resetAllBanks } = require('../controllers/wallets');
const { deleteOrders } = require('../controllers/order');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const Login = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const user = await User.login(username, password)
        // console.log(user.msg.id)
        const token = createToken(user.msg.id)
        // console.log(token)
        req.session.userId = user.msg.id;
        // console.log(req.session.userId,"pio")
        res.status(200).json({user, token})
    }
    catch (error) {
        console.log(error.message)
        res.status(200).json({ error: error.message })
    }
}


const Register = async(req,res) =>{
    const {username, name, password} = req.body;
    let newUser = new User({
        username,name,password
    })
    try{
        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log("error");

                };
                newUser.password = hash;
                newUser.save()
                res.json(newUser)
            });
        });
    }
    catch(err){
        console.log(err)
    }
}

const ResetSystem = async(req,res)=>{
    let result;
    try{
        await resetClients()
        await resetAllIronArray()
        await resetAllBanks()
        await deleteOrders()
    }
    catch(err){
        console.log(err)
    }
    res.json({"state":"done"})
}

module.exports = {
    Login,
    Register,
    ResetSystem
}