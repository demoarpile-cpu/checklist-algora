const express = require("express");
const upload = require("../Middewares/Cloudinary");
const { authMiddleware } = require("../Middewares/authMiddleware");

const {
  getAllUnits,
  addUnits,
  getallbranchcode,
  geteconomicnumber,
  updateUnits,
  deleteUnits
} = require("../Controllers/UnitCtrl");

const router = express.Router();

router.get("/unit", authMiddleware, getAllUnits);
router.get("/getallbranchcode", getallbranchcode);
router.get("/geteconomicnumber", geteconomicnumber);

router.post(
  "/unit",
  authMiddleware,
  upload.fields([
    { name: "insuranceUpload", maxCount: 1 },
    { name: "vehicleCardUpload", maxCount: 1 }
  ]),
  addUnits
);

router.put(
  "/unit/:id",
  authMiddleware,
  upload.fields([
    { name: "insuranceUpload", maxCount: 1 },
    { name: "vehicleCardUpload", maxCount: 1 }
  ]),
  updateUnits
);

router.delete("/unit/:id", authMiddleware, deleteUnits);

module.exports = router;
