const express = require("express");
const {
  getallcategory,
  addcategory,
  getallcategoryName,
  deletecategory,
  updatecategory,
} = require("../Controllers/CategoryCtrl.js");

const { authMiddleware } = require("../Middewares/authMiddleware.js");

const router = express.Router();

router.get("/vehicle-category", authMiddleware, getallcategory);
router.get("/getallcategory", authMiddleware, getallcategoryName);
router.post("/vehicle-category", authMiddleware, addcategory);
router.put("/vehicle-category/:id", authMiddleware, updatecategory);
router.delete("/vehicle-category/:id", authMiddleware, deletecategory);

module.exports = router;
