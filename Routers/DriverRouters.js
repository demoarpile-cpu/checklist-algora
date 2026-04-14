const express = require("express");
const multer = require("multer");
const {
  createuser,
  loginAdmin,
  editUser,
  deleteUser,
  getAllUser,
  getAllUserData,
  toogleStatus,
  getdriverByBranch,
  verifymobile
} = require("../Controllers/DriverCtrl");
const { uploadSingleImageToCloudinary } = require("../Middewares/singleImgUpload");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/create-driver", upload.single('profileimage'), uploadSingleImageToCloudinary, createuser);
router.put("/editdriver/:id", upload.single('profileimage'), uploadSingleImageToCloudinary, editUser);
router.delete("/deletedriver/:id", deleteUser);
router.get("/getalldriver", getAllUser);
router.get("/getalldriverdata", getAllUserData);
router.post("/getdriverByBranch", getdriverByBranch);
router.patch("/toogleStatus/:id", toogleStatus);
router.patch("/verifymobile/:id", verifymobile);

module.exports = router;
