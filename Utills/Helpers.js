const Checklist = require("../Models/CheckListModel");
const RouteModels = require("../Models/RouteModels");
const FillSchema = require("../Models/FillCheckListModel");

// ✅ Get checklist questions by checklist ID
async function getQuestionsById(id = "") {
  if (!id) return [];

  const checklist = await Checklist.findById(id).select("answers");
  return checklist?.answers || [];
}

// ✅ Get answers by user/fill ID
async function getAnswersById(user_id = "") {
  if (!user_id) return [];

  const filled = await FillSchema.findOne({ _id: user_id });
  return filled?.answers || [];
}

// ✅ Get routes by branch ID
async function getRouteByBranchId(branchId = "") {
  if (!branchId) return [];

  const routes = await RouteModels.find({ branchCode: branchId });
  return routes || [];
}

module.exports = {
  getQuestionsById,
  getAnswersById,
  getRouteByBranchId
};
