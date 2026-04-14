const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  createuser,
  editUser,
  deleteUser,
  getAllUser,
  getAllUserData,
  getProfile
} = require("../Controllers/UserCtrl");

const router = express.Router();

router.post("/create-user", createuser);
router.put("/edituser/:id", editUser);
router.delete("/deleteuser/:id", deleteUser);
router.get("/getalluser", getAllUser);
router.get("/getalluserdata", getAllUserData);
router.get("/profile/:id", getProfile);

module.exports = router;
