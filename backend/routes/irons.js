const express = require('express');
const router = express.Router();
const {getIronStorage, subtractIronWeight, addIron, addIronWeight, changeIronWeight, getScaleWeight, handleChangePassword} = require('../controllers/irons')
router.post('/getIronStorage', getIronStorage)
router.post('/addIron', addIron)
router.post('/addIronWeight', addIronWeight)
router.post('/subtractIronWeight', subtractIronWeight)
router.post('/changeIronWeight', changeIronWeight)
router.get('/getScaleWeight',getScaleWeight)
router.post('/checkChangePassword',handleChangePassword)




module.exports = router;