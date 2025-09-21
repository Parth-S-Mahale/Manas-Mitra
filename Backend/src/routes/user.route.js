const express=require('express')
const router=express.Router()

const { sendOTP, signUp, login } = require('../controllers/auth.controller.js');

router.post('/signup', signUp);

router.post('/login', login);

router.post('/send-otp', sendOTP);

module.exports = router;

