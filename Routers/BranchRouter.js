const express = require("express");
const {
  getallbranch,
  branchforchecklist,
  addbranch,
  getbranchname,
  deletebranch,
  updatebranch,
} = require("../Controllers/BranchCtrl.js");

const { authMiddleware } = require("../Middewares/authMiddleware.js");

const router = express.Router();

router.get("/branch", authMiddleware, getallbranch);
router.get("/branchforchecklist", branchforchecklist);
router.get("/getbranchname", authMiddleware, getbranchname);
router.post("/branch", authMiddleware, addbranch);
router.put("/branch/:id", authMiddleware, updatebranch);
router.delete("/branch/:id", authMiddleware, deletebranch);

module.exports = router;
