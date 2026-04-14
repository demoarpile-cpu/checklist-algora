const express = require("express");
const {
  getallchecklist,
  getchecklistbyid,
  addchecklist,
  fillchecklist,
  deletefillchecklist,
  getAllCheckListData,
  getfillchecklist,
  deletechecklist,
  updatechecklist,
  getresponse,
  getchecklistByDriverid,
  getAllCheckListDatabyDriverId,
  uploadData
} = require("../Controllers/CheckListCtrl.js");

const { authMiddleware } = require("../Middewares/authMiddleware.js");
const upload  = require("../Middewares/uploadChecklistimag.js");

const router = express.Router();

router.get("/checklist", getallchecklist);
router.get("/getchecklistByDriverid", getchecklistByDriverid);
router.get("/getchecklistbyid/:id", getchecklistbyid);
router.post("/createchecklist", uploadData.array("images"), addchecklist);
router.post("/fillchecklist", uploadData.array("images"), fillchecklist);
router.get("/fillchecklist/:driverId", getfillchecklist);
router.get("/getallfillchecklist", getAllCheckListData);
router.get("/getAllCheckListDatabyDriverId/:driverId", getAllCheckListDatabyDriverId);

router.post(
  "/checklist/upload-answer-image",
  authMiddleware,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.status(200).json({
      success: true,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      message: "Image uploaded successfully"
    });
  }
);

router.put("/checklist/:id", authMiddleware, updatechecklist);
router.delete("/checklist/:id", authMiddleware, deletechecklist);
router.delete("/fillchecklist/:id", deletefillchecklist);
router.get("/response", getresponse);

module.exports = router;
