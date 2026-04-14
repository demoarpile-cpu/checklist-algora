const Schema = require("../Models/UnitModel");
const Branch = require("../Models/BranchModel");
const Vehicle = require("../Models/VehicleModel");
const asyncHandler = require("express-async-handler");

// GET all units
const getAllUnits = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// GET all branch codes
const getallbranchcode = asyncHandler(async (req, res) => {
  try {
    const data = await Branch.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// GET economic numbers by branchCode
const geteconomicnumber = asyncHandler(async (req, res) => {
  const { branchCode } = req.query;
  if (!branchCode) {
    return res.status(400).json({ message: "branchCode is required" });
  }

  try {
    const data = await Vehicle.find({ branchCode })
      .select("economicNumber")
      .sort({ economicNumber: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD unit
const addUnits = asyncHandler(async (req, res) => {
  try {
    const insuranceUploadUrl = req.files?.insuranceUpload
      ? req.files.insuranceUpload[0].path
      : null;

    const vehicleCardUploadUrl = req.files?.vehicleCardUpload
      ? req.files.vehicleCardUpload[0].path
      : null;

    const unitData = {
      ...req.body,
      insuranceUpload: insuranceUploadUrl,
      vehicleCardUpload: vehicleCardUploadUrl
    };

    const data = await Schema.create(unitData);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// UPDATE unit
const updateUnits = asyncHandler(async (req, res) => {
  try {
    const insuranceUploadUrl = req.files?.insuranceUpload
      ? req.files.insuranceUpload[0].path
      : null;

    const vehicleCardUploadUrl = req.files?.vehicleCardUpload
      ? req.files.vehicleCardUpload[0].path
      : null;

    const unitData = {
      ...req.body,
      insuranceUpload: insuranceUploadUrl,
      vehicleCardUpload: vehicleCardUploadUrl
    };

    const data = await Schema.findByIdAndUpdate(req.params.id, unitData, { new: true });
    res.status(200).json({ data, message: "Unit updated successfully", success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, message: "Unit not updated", success: false });
  }
});

// DELETE unit
const deleteUnits = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndDelete(req.params.id);
    res.status(200).json({ data, message: "Unit deleted successfully", success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, message: "Unit not deleted", success: false });
  }
});

module.exports = {
  getAllUnits,
  addUnits,
  getallbranchcode,
  geteconomicnumber,
  updateUnits,
  deleteUnits
};
