// routes/PositionRoutes.js
const express = require("express");
const {
  getallposition,
  addposition,
  updateposition,
  deleteposition
} = require("../Controllers/PositionCtrl");
const { authMiddleware } = require("../Middewares/authMiddleware");

const router = express.Router();

router.get("/position", getallposition);
router.post("/position", addposition);
router.put("/position/:id", updateposition);
router.delete("/position/:id", deleteposition);

module.exports = router;
