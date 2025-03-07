const express = require('express');
const { addFactory , getFactoryInfo } = require('../controllers/factory');
const router = express.Router();

router.get('/getFactoryInfo', getFactoryInfo);
router.post('/addFactory', addFactory);




module.exports = router;