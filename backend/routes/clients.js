const express = require('express');
const { updateBalances,getClientsInfo , addClients , updateClientsInfo } = require('../controllers/clients');
const requireAuth = require('../config/auth')
const router = express.Router();

router.get('/getClientsInfo',requireAuth, getClientsInfo);
router.post('/addClient',requireAuth, addClients);
router.post('/updateClients', requireAuth,updateClientsInfo);
router.post('/updateBalances',requireAuth,updateBalances )



module.exports = router;