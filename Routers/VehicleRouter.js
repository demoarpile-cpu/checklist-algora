const express = require('express');
const upload = require("../Middewares/Cloudinary");

const {
  deleteVehicle,
  getVehicleById,
  getVehicles,
  updateVehicle,
  createVehicle
} = require('../Controllers/VehicleCtrl');

const router = express.Router();

router.post('/vehicle', upload.fields([
    { name: "uploadInsurance", maxCount: 1 },
    { name: "vehicleCard", maxCount: 1 },
]), createVehicle);

router.get('/vehicle', getVehicles);
router.get('/vehicle/:id', getVehicleById);

router.put('/vehicle/:id', upload.fields([
    { name: "uploadInsurance", maxCount: 1 },
    { name: "vehicleCard", maxCount: 1 },
]), updateVehicle);

router.delete('/vehicle/:id', deleteVehicle);

module.exports = router;
