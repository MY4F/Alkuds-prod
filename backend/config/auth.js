const jwt = require('jsonwebtoken')
const UserV2 = require('../models/user')

const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization } = req.headers
  console.log("heeee")
  console.log(authorization)
  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]

  try {
    console.log(token,"heeree")
    const { _id } = jwt.verify(token, process.env.SECRET)
    console.log(_id)
    req.user = await UserV2.findOne({ _id })
    console.log(req.session.userId)
    console.log(req.user,"user is here")
    if(req.user && req.session.userId === _id){
      next()
    }
    else{
      throw new Error("Malformed data / user id");
    }

  } catch (error) {
    console.log(error)
    console.log(token)
    res.status(401).json({'error': error})
  }
}

module.exports = requireAuth