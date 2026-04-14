const express = require("express");
const {
  getChecklistPerBranchReport,
  checklistPerRouteData,
  FilledChecklistByRouteId,
  FilledChecklistByBranchId,
  checklistperroute,
  getChecklistPerBranchReportanswerReport,
  checklistecnomicunit,
  checklistByBranchId,
  checklistAnswerReport,
  checklistanswerreport
} = require("../Controllers/ReportCtrl.js");

const router = express.Router();

router.get("/checklistperbranch", getChecklistPerBranchReport);
router.get("/checklistperroutedata", checklistPerRouteData);
router.get("/checklistAnswerReport", checklistAnswerReport);
router.get("/checklistByBranchId/:branchId", checklistByBranchId);
router.get("/checklistperroute", checklistperroute);
router.get("/checklistanswerreportunit", getChecklistPerBranchReportanswerReport);
router.post("/FilledChecklistByBranchId", FilledChecklistByBranchId);
router.post("/FilledChecklistByRouteId", FilledChecklistByRouteId);
router.get("/checklistanswerreportdata", checklistanswerreport);
router.get("/checklistecnomicunit", checklistecnomicunit);

module.exports = router;
