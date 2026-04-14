const VehicleDivision = require('../Models/VehicleDivisionModel');

// CREATE VEHICLE DIVISION
const createVehicleDivision = async (req, res) => {
  try {
    const vehicleDivision = new VehicleDivision(req.body);
    await vehicleDivision.save();
    res.status(201).json(vehicleDivision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL VEHICLE DIVISIONS
const getVehicleDivisions = async (req, res) => {
  try {
    const vehicleDivisions = await VehicleDivision.find();
    res.status(200).json(vehicleDivisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET VEHICLE DIVISION BY ID
const getVehicleDivisionById = async (req, res) => {
  try {
    const vehicleDivision = await VehicleDivision.findById(req.params.id);
    if (!vehicleDivision) return res.status(404).json({ message: "Vehicle division not found" });
    res.status(200).json(vehicleDivision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE VEHICLE DIVISION BY ID
const updateVehicleDivision = async (req, res) => {
  try {
    const vehicleDivision = await VehicleDivision.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!vehicleDivision) return res.status(404).json({ message: "Vehicle division not found" });
    res.status(200).json(vehicleDivision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE VEHICLE DIVISION BY ID
const deleteVehicleDivision = async (req, res) => {
  try {
    const vehicleDivision = await VehicleDivision.findByIdAndDelete(req.params.id);
    if (!vehicleDivision) return res.status(404).json({ message: "Vehicle division not found" });
    res.status(200).json({ message: "Vehicle division deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVehicleDivision,
  getVehicleDivisions,
  getVehicleDivisionById,
  updateVehicleDivision,
  deleteVehicleDivision
};
