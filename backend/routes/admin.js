const express = require('express');
const { getProfitReportDataBasedOnDate } = require('../controllers/admin');
const router = express.Router();

router.post('/getProfitReportDataBasedOnDate', getProfitReportDataBasedOnDate);

module.exports = router;