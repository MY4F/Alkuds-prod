const express = require('express');
const { getDriversInfo , addDriver , updateDriversInfo } = require('../controllers/driver');
const router = express.Router();



router.get("/getDriversInfo" , getDriversInfo);
router.post("/addDriver" , addDriver);


module.exports = router; 