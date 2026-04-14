const User = require("../Models/PatientsModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const UserMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
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
const isUser = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne(email);
  if (adminUser.role !== "patient") {
    throw new Error("your are not a patient");
  } else {
    next();
  }
});
module.exports = { UserMiddleware, isUser };

// cloudinary.config({
//   cloud_name: 'dfporfl8y',
//   api_key: '244749221557343',
//   api_secret: 'jDkVlzvkhHjb81EvaLjYgtNtKsY',
// });
