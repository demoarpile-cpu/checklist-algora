const asyncHandler = require("express-async-handler");
const Driver = require("../../Models/DriverModel.js");
const Checklist = require("../../Models/CheckListModel.js");
const FillCheckListModel = require("../../Models/FillCheckListModel.js");

// Branch-wise checklist report
const getAllChecklistPerBranchReport = asyncHandler(async (req, res) => {
  try {
    const checklistPerBranch = await Checklist.aggregate([
      { $unwind: "$branches" },
      {
        $group: {
          _id: "$branches",
          RequiredReports: { $sum: 1 },
          checklistIds: { $addToSet: "$_id" },
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "_id",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$branch" },
      {
        $project: {
          _id: 1,
          branchName: "$branch.branchName",
          RequiredReports: 1,
          checklistIds: 1,
        },
      },
    ]);

    for (let branch of checklistPerBranch) {
      const filledCount = await FillCheckListModel.countDocuments({
        BranchId: branch._id,
        checklistId: { $in: branch.checklistIds },
      });

      branch.filledRequiredReports = filledCount;
      branch.pendingRequiredReports =
        branch.RequiredReports - branch.filledRequiredReports;

      branch.filledPercentage =
        branch.RequiredReports > 0
          ? ((branch.filledRequiredReports / branch.RequiredReports) * 100).toFixed(2)
          : "0.00";

      branch.pendingPercentage =
        branch.RequiredReports > 0
          ? ((branch.pendingRequiredReports / branch.RequiredReports) * 100).toFixed(2)
          : "0.00";

      delete branch.checklistIds;
    }

    res.status(200).json({
      success: true,
      message:
        "Driver count vs filled & pending checklist count per branch with percentage",
      data: checklistPerBranch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Error fetching driver count per checklist branch",
    });
  }
});

// Route-wise checklist report (same logic as branch report)
const ChecklistPerRouteReportRouter = asyncHandler(async (req, res) => {
  try {
    const checklistPerBranch = await Checklist.aggregate([
      { $unwind: "$branches" },
      {
        $group: {
          _id: "$branches",
          RequiredReports: { $sum: 1 },
          checklistIds: { $addToSet: "$_id" },
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "_id",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$branch" },
      {
        $project: {
          _id: 1,
          branchName: "$branch.branchName",
          RequiredReports: 1,
          checklistIds: 1,
        },
      },
    ]);

    for (let branch of checklistPerBranch) {
      const filledCount = await FillCheckListModel.countDocuments({
        BranchId: branch._id,
        checklistId: { $in: branch.checklistIds },
      });

      branch.filledRequiredReports = filledCount;
      branch.pendingRequiredReports =
        branch.RequiredReports - branch.filledRequiredReports;

      branch.filledPercentage =
        branch.RequiredReports > 0
          ? ((branch.filledRequiredReports / branch.RequiredReports) * 100).toFixed(2)
          : "0.00";

      branch.pendingPercentage =
        branch.RequiredReports > 0
          ? ((branch.pendingRequiredReports / branch.RequiredReports) * 100).toFixed(2)
          : "0.00";

      delete branch.checklistIds;
    }

    res.status(200).json({
      success: true,
      message:
        "Driver count vs filled & pending checklist count per branch with percentage",
      data: checklistPerBranch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Error fetching driver count per checklist branch",
    });
  }
});

module.exports = {
  getAllChecklistPerBranchReport,
  ChecklistPerRouteReportRouter,
};
