const express = require('express');
const {
  createVehicleType,
  getVehicleTypes,
  getVehicleTypeById,
  updateVehicleType,
  deleteVehicleType
} = require('../Controllers/VehicleTypeCtrl');

const router = express.Router();

router.post('/vehicletype', createVehicleType);
router.get('/vehicletype', getVehicleTypes);
router.get('/vehicletype/:id', getVehicleTypeById);
router.put('/vehicletype/:id', updateVehicleType);
router.delete('/vehicletype/:id', deleteVehicleType);

module.exports = router;
