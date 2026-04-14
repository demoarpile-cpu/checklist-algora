const Schema = require("../Models/UserModel");
const Role = require("../Models/RoleModel");
const DriverSchema = require("../Models/DriverModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../Config/jwtToken");
const bcrypt = require("bcrypt");
const { isValidObjectId } = require("../Utills/isValidObjectId");

// CREATE USER
const createuser = asyncHandler(async (req, res) => {
  const existingUser = await Schema.findOne({ username: req.body.username });

  if (existingUser) {
    return res.status(409).json({ message: "Username already exists", success: false });
  }

  const data = await Schema.create(req.body);
  res.status(200).json({ data, message: "User created successfully", success: true });
});

// EDIT USER
const editUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format", success: false });
  }

  try {
    const updatedData = { ...req.body };

    if (req.uploadedImageUrl) {
      updatedData.profileimage = req.uploadedImageUrl;
    }

    const updatedUser = await Schema.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    res.status(200).json({ data: updatedUser, message: "User updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    let deletedUser = await Schema.findByIdAndDelete(id);

    if (!deletedUser) {
      deletedUser = await DriverSchema.findByIdAndDelete(id);
    }

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    res.status(200).json({ message: "User deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// GET ALL USERS (minimal info)
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await Schema.find({}).select("username id");
    res.status(200).json({ data: users, message: "Users fetched successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// GET ALL USERS + DRIVERS
const getAllUserData = asyncHandler(async (req, res) => {
  try {
    const users = await Schema.find({ role: { $ne: "6858e650efc7bf2dc886364a" } })
      .select("-password")
      .populate("role", "roleName")
      .exec();

    const drivers = await DriverSchema.find({})
      .select("-password")
      .populate("role", "roleName")
      .exec();

    const allUsers = [...users, ...drivers];

    res.status(200).json({
      data: allUsers,
      message: "Users fetched successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// GET PROFILE
const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid ID format", success: false });
  }

  try {
    const user = await Schema.findById(id).select("-password").populate('role', 'roleName');

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const driver = await DriverSchema.findOne({ userId: id });
    if (driver) user.driverDetails = driver;

    let userObj = user.toObject();
    if (userObj.role) {
      userObj.roleId = userObj.role._id;
      userObj.roleName = userObj.role.roleName;
      delete userObj.role;
    }

    res.status(200).json({ data: userObj, message: "User profile fetched successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = {
  createuser,
  editUser,
  deleteUser,
  getAllUser,
  getAllUserData,
  getProfile
};
