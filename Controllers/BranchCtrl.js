const Schema = require("../Models/BranchModel.js");
const VehicleModel = require("../Models/VehicleModel.js");
const DriverModel = require("../Models/DriverModel.js");
const asyncHandler = require("express-async-handler");

// Get all branches
const getallbranch = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Branch list for checklist (unique branches from drivers)
const branchforchecklist = asyncHandler(async (req, res) => {
  try {
    const data = await DriverModel.find()
      .populate({
        path: "assignVehicles",
        select: "branchCode",
        populate: {
          path: "branchCode",
          select: "branchName",
        },
      })
      .select("assignVehicles");

    const branchMap = new Map();
    data.forEach((driver) => {
      const branch = driver.assignVehicles?.branchCode;
      if (branch?._id) {
        branchMap.set(branch._id.toString(), {
          _id: branch._id,
          branchName: branch.branchName,
        });
      }
    });

    const uniqueBranches = Array.from(branchMap.values());
    res.status(200).json(uniqueBranches);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get branch codes only
const getbranchname = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find();
    const branchname = data.map((item) => ({
      branchCode: item.branchCode,
    }));
    res.status(200).json(branchname);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Add new branch
const addbranch = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.create(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Update branch
const updatebranch = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      data,
      message: "Branch updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Branch not updated",
      success: false,
    });
  }
});

// Delete branch
const deletebranch = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data,
      message: "Branch deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Branch not deleted",
      success: false,
    });
  }
});

module.exports = {
  getallbranch,
  branchforchecklist,
  addbranch,
  getbranchname,
  deletebranch,
  updatebranch,
};
