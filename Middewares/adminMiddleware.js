const admin = require('../Models/DoctorModel')
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const patient = require('../Models/PatientsModel')
const adminMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await admin.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token , Please Login again");
    }
  } else {
    throw new Error("Please Login Doctor");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await admin.findOne({ email });
  if (adminUser.role !== "doctor") {
    throw new Error("You are not an doctor!!!");
  } else {
    next();
  }
});

module.exports = {
  adminMiddleware,
  isAdmin,
};