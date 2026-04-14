const express = require("express");
const { 
  getAllRoute, 
  addRoute, 
  updateRoute, 
  deleteRoute, 
  getroutenamebybranchid, 
  getAppAPi 
} = require("../Controllers/RouteCtrl");
const { authMiddleware } = require("../Middewares/authMiddleware");

const router = express.Router();

router.get("/route", authMiddleware, getAllRoute);
router.get("/getroutenamebybranchid/:barnchId", authMiddleware, getroutenamebybranchid);
router.get("/data/:username", getAppAPi);
router.post("/route", authMiddleware, addRoute);
router.put("/route/:id", authMiddleware, updateRoute);
router.delete("/route/:id", authMiddleware, deleteRoute);

module.exports = router;
