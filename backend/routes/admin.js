const express = require('express');
const { getProfitReportDataBasedOnDate } = require('../controllers/admin');
const router = express.Router();

router.get('/getProfitReportDataBasedOnDate', getProfitReportDataBasedOnDate);

module.exports = router;