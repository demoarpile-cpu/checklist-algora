const express = require('express');
const { sendOtp, validateOtp } = require('../Controllers/VerifyOtpCtrl');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.get('/validate-otp', validateOtp);

module.exports = router;
