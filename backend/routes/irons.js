const express = require('express');
const router = express.Router();
const requireAuth = require('../config/auth')

const {getIronStorageNonAdmin, getIronList, getIronStorageAdmin, addIron, changeIronWeight, getScaleWeight, handleChangePassword} = require('../controllers/irons')
router.post('/getIronStorage',requireAuth, getIronStorageAdmin)
router.post('/getIronStorageNonAdmin',requireAuth, getIronStorageNonAdmin)
router.post('/addIron',requireAuth, addIron)
router.post('/changeIronWeight',requireAuth, changeIronWeight)
router.get('/getScaleWeight',getScaleWeight)
router.post('/checkChangePassword',requireAuth,handleChangePassword)
router.get('/getIronList',requireAuth,getIronList)




module.exports = router;