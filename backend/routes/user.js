const express = require('express');
const { Login, Register, ResetSystem } = require('../controllers/user');
const router = express.Router();

router.post("/login", Login)
router.post("/register", Register)
router.get("/resetSystem",ResetSystem)



module.exports = router;