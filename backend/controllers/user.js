const User = require('../models/user');
const bcrypt = require('bcrypt')
const Login = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const user = await User.login(username, password)
        // create a token
        //console.log(token, user)
        res.status(200).json(user)
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

module.exports = {
    Login,
    Register
}