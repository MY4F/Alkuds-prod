const express = require('express');
const router = express.Router();
const { getWalletInventoryByDate,addCompanyExpenses, addBank, getTransactionsGroupedByBank, addTransaction, getSpecificClientTransactions  } = require('../controllers/wallets'); 

router.get("/getSpecificClientTransactions/:id", getSpecificClientTransactions)
router.get("/getTransactionsGroupedByBank", getTransactionsGroupedByBank)
router.post("/addTransaction", addTransaction)
router.post("/addCompanyExpenses", addCompanyExpenses)
router.post("/addBank", addBank)
router.post("/getWalletInventoryByDate", getWalletInventoryByDate)




module.exports = router;