const Schema = require("../Models/CompanyModel");
const asyncHandler = require("express-async-handler");

const getallCompany = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

const getallCompanyName = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find()
      .select("companyName")
      .sort({ companyName: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

const addCompany = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.create(req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
});

const updateCompany = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ data, message: "Company updated successfully", success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, message: "Company not updated", success: false });
  }
});

const deleteCompany = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndDelete(req.params.id);
    res.status(200).json({ data, message: "Company deleted successfully", success: true });
  } catch (error) {
    res.status(404).json({ error: error.message, message: "Company not deleted", success: false });
  }
});

module.exports = {
  getallCompany,
  getallCompanyName,
  addCompany,
  updateCompany,
  deleteCompany,
};
