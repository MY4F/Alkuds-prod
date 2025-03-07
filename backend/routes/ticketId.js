const express = require('express');
const router = express.Router();
const { getId, addId  } = require('../controllers/ticketId'); 

router.get("/getId", getId)
router.get("/addId", addId)





module.exports = router;