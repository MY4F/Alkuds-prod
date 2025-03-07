const express = require('express');
const { getClientsInfo , addClients , updateClientsInfo } = require('../controllers/clients');
const router = express.Router();

router.get('/getClientsInfo', getClientsInfo);
router.post('/addClient', addClients);
router.post('/updateClients', updateClientsInfo);




module.exports = router;