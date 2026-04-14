// Controllers/InsuranceCtrl.js
const Insurance = require('../Models/InsuranceModel');

// Create new insurance
const createInsurance = async (req, res) => {
  try {
    const { companyName } = req.body;
    const documentUrl = req.uploadedFileUrl || null; // Cloudinary uploaded file URL

    const insurance = await Insurance.create({
      companyName,
      documentUrl
    });

    res.status(201).json({ success: true, message: "Insurance created", data: insurance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update insurance by ID
const updateInsurance = async (req, res) => {
  try {
    const { companyName } = req.body;
    const documentUrl = req.uploadedFileUrl || null;

    const insurance = await Insurance.findById(req.params.id);
    if (!insurance) return res.status(404).json({ success: false, message: "Insurance not found" });

    if (companyName) insurance.companyName = companyName;
    if (documentUrl) insurance.documentUrl = documentUrl;

    const updatedInsurance = await insurance.save();

    res.status(200).json({ success: true, message: "Insurance updated", data: updatedInsurance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all insurances
const getInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find();
    res.status(200).json({ success: true, data: insurances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get insurance by ID
const getInsuranceById = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);
    if (!insurance) return res.status(404).json({ success: false, message: "Insurance not found" });
    res.status(200).json({ success: true, data: insurance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete insurance by ID
const deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndDelete(req.params.id);
    if (!insurance) return res.status(404).json({ success: false, message: "Insurance not found" });
    res.status(200).json({ success: true, message: "Insurance deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInsurance,
  updateInsurance,
  getInsurances,
  getInsuranceById,
  deleteInsurance
};
