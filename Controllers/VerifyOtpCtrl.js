const axios = require('axios');
const OtpLog = require('../Models/OtpModel');

const customerId = "C-502C68669AC14C6";
const authToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTUwMkM2ODY2OUFDMTRDNiIsImlhdCI6MTc1Mzc3MzgwNSwiZXhwIjoxOTExNDUzODA1fQ.0ub4bU82YBFl5tFXsGqWNZnJR2rkaJ1DIkQBbwWDfJnOnTGCOx6Q7EvsaSosPxpJrHE1mPQzg4B1hkOewNS-bg";

const sendOtp = async (req, res) => {
  const { countryCode, mobileNumber } = req.query;

  try {
    const response = await axios.post(
      "https://cpaas.messagecentral.com/verification/v3/send",
      {},
      {
        params: {
          countryCode,
          customerId,
          flowType: "SMS",
          mobileNumber,
        },
        headers: {
          authToken: authToken,
        },
      }
    );

    const otpLog = await OtpLog.create({
      mobileNumber,
      countryCode,
      verificationId: response?.data?.data?.verificationId,
      isVerified: false,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otpLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "OTP sending failed",
      error: error?.response?.data || error.message,
    });
  }
};

const validateOtp = async (req, res) => {
  const { countryCode, mobileNumber, verificationId, code } = req.query;

  try {
    const response = await axios.get(
      "https://cpaas.messagecentral.com/verification/v3/validateOtp",
      {
        params: {
          countryCode,
          mobileNumber,
          verificationId,
          customerId,
          code,
        },
        headers: {
          authToken: authToken,
        },
      }
    );

    const updatedOtp = await OtpLog.findOneAndUpdate(
      { verificationId },
      { isVerified: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: response.data,
      otpLog: updatedOtp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "OTP validation failed",
      error: error?.response?.data || error.message,
    });
  }
};

module.exports = {
  sendOtp,
  validateOtp
};
