const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    driverStatus: {
      type: Boolean,
      default: true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Roles"
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
