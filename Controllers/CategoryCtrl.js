const Schema = require("../Models/CategoryModel.js");
const asyncHandler = require("express-async-handler");

// Get all categories
const getallcategory = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get category names only
const getallcategoryName = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.find();
    const categoryname = data.map((item) => ({
      categoryname: item.categoryname,
    }));
    res.status(200).json(categoryname);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Add category
const addcategory = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.create(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Update category
const updatecategory = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      data,
      message: "Category updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Category not updated",
      success: false,
    });
  }
});

// Delete category
const deletecategory = asyncHandler(async (req, res) => {
  try {
    const data = await Schema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data,
      message: "Category deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      error: error.message,
      message: "Category not deleted",
      success: false,
    });
  }
});

module.exports = {
  getallcategory,
  addcategory,
  getallcategoryName,
  deletecategory,
  updatecategory,
};
