const express = require("express");
const {
  getAllChecklistPerBranchReport,
  ChecklistPerRouteReportRouter,
} = require("../../Controllers/Reports/ChecklistPerBranchReportCtrl.js");

const router = express.Router();

router.get("/checklist-per-branch-report", getAllChecklistPerBranchReport);
router.get("/checklist-per-route-report", ChecklistPerRouteReportRouter);

module.exports = router;
