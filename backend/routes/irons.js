const express = require('express');
const router = express.Router();
const requireAuth = require('../config/auth')

const {getIronStorageAdmin, addIron, changeIronWeight, getScaleWeight, handleChangePassword} = require('../controllers/irons')
router.post('/getIronStorage',requireAuth, getIronStorageAdmin)
router.post('/addIron',requireAuth, addIron)
router.post('/changeIronWeight',requireAuth, changeIronWeight)
router.get('/getScaleWeight',requireAuth,getScaleWeight)
router.post('/checkChangePassword',requireAuth,handleChangePassword)




module.exports = router;