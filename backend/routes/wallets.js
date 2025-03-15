const express = require('express');
const router = express.Router();
const { addTransaction, getSpecificClientTransactions  } = require('../controllers/wallets'); 

router.get("/getSpecificClientTransactions/:id", getSpecificClientTransactions)
router.post("/addTransaction", addTransaction)





module.exports = router;