// routes/InsuranceRoutes.js
const express = require('express');
const multer = require('multer');
const {
  createInsurance,
  getInsurances,
  getInsuranceById,
  updateInsurance,
  deleteInsurance
} = require('../Controllers/InsuranceCtrl');
const { uploadSingleFileToCloudinary } = require("../Middewares/uploadPDF");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/insurance', upload.single('documentUrl'), uploadSingleFileToCloudinary, createInsurance);
router.get('/insurance', getInsurances);
router.get('/insurance/:id', getInsuranceById);
router.put('/insurance/:id', upload.single('documentUrl'), uploadSingleFileToCloudinary, updateInsurance);
router.delete('/insurance/:id', deleteInsurance);

module.exports = router;
