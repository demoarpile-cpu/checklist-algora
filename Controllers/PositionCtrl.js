// Controllers/PositionCtrl.js
const Schema = require("../Models/PositionModel");
const asyncHandler = require('express-async-handler');

const getallposition = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

const addposition = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.create(req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

const updateposition = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, message: "Position updated successfully", data });
  } catch (error) {
    res.status(404).json({ success: false, message: "Position not updated", error: error.message });
  }
});

const deleteposition = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Position deleted successfully", data });
  } catch (error) {
    res.status(404).json({ success: false, message: "Position not deleted", error: error.message });
  }
});

module.exports = {
  getallposition,
  addposition,
  updateposition,
  deleteposition
};
