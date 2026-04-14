const Driver = require("../Models/DriverModel");
const User = require("../Models/UserModel");
const Vehicle = require("../Models/VehicleModel");
const CheckListPerRouteRouter = require("../Models/CheckListModel");
const asyncHandler = require("express-async-handler");

const getDashboardData = asyncHandler(async (req, res) => {
  try {
    const [driverCount, userCount, vehicleCount, checklistCount] = await Promise.all([
      Driver.countDocuments(),
      User.countDocuments(),
      Vehicle.countDocuments(),
      CheckListPerRouteRouter.countDocuments(),
    ]);

    res.status(200).json({
      driverCount,
      userCount,
      vehicleCount,
      checklistCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { getDashboardData };
