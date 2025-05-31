const express = require('express');
const { getProfitReportDataBasedOnDate } = require('../controllers/admin');
const requireAuth = require('../config/auth')

const router = express.Router();

router.post('/getProfitReportDataBasedOnDate',requireAuth, getProfitReportDataBasedOnDate);

module.exports = router; 