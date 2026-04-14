const express = require('express');
const {
  createVehicleDivision,
  getVehicleDivisions,
  getVehicleDivisionById,
  updateVehicleDivision,
  deleteVehicleDivision
} = require('../Controllers/VehicleDivisionCtrl');

const router = express.Router();

router.post('/vehicledivision', createVehicleDivision);
router.get('/vehicledivision', getVehicleDivisions);
router.get('/vehicledivision/:id', getVehicleDivisionById);
router.put('/vehicledivision/:id', updateVehicleDivision);
router.delete('/vehicledivision/:id', deleteVehicleDivision);

module.exports = router;
