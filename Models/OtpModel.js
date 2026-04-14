const mongoose = require("mongoose");

const otpLogSchema = new mongoose.Schema({
  mobileNumber: String,
  countryCode: String,
  verificationId: String,
  transactionId: String,
  timeout: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Otp", otpLogSchema);
