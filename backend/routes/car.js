const express = require('express');
const { getCarInfo , addCar } = require('../controllers/car');
const router = express.Router();

router.get('/getCarInfo', getCarInfo);
router.post('/postCarInfo', addCar);

module.exports = router;