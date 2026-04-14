const Schema = require("../Models/DepartmentModel.js");
const asyncHandler = require("express-async-handler");

const getalldepartment = asyncHandler(async (req, res) => {
    try {
        const data = await Schema.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json(error.message);
    }
});

const adddepartment = asyncHandler(async (req, res) => {
    try {
        const data = await Schema.create(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json(error.message);
    }
});

const updatedepartment = asyncHandler(async (req, res) => {
    try {
        const data = await Schema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json({ data, message: "department updated successfully", success: true });
    } catch (error) {
        res.status(404).json({ error: error.message, message: "department not updated", success: false });
    }
});

const deletedepartment = asyncHandler(async (req, res) => {
    try {
        const data = await Schema.findByIdAndDelete(req.params.id);
        res.status(200).json({ data, message: "department deleted successfully", success: true });
    } catch (error) {
        res.status(404).json({ error: error.message, message: "department not deleted", success: false });
    }
});

module.exports = {
    getalldepartment,
    adddepartment,
    updatedepartment,
    deletedepartment
};
