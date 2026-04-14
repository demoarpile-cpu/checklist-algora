const Admin = require("../Models/DriverModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Admin.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(401).json({ success: false, message: "Not Authorized, token expired. Please login again" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token attached to header" });
  }
});

module.exports = { authMiddleware };
