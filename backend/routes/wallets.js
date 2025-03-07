const express = require('express');
const router = express.Router();
const { addTransaction  } = require('../controllers/wallets'); 

router.post("/addTransaction", addTransaction)





module.exports = router;