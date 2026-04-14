const client = require('../Models/StaffModel')
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const clientMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await client.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
    throw new Error(" There is no token attached to header");
  }
});
const isClient = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await client.findOne({ email });
  if (adminUser.role !== "staff") {
    throw new Error("You are not an staff");
  } else {
    next();
  }
});
module.exports = { clientMiddleware, isClient };