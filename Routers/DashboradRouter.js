const express = require("express");
const { getDashboardData } = require("../Controllers/DashboardCtrl");

const router = express.Router();

router.get("/dashboard", getDashboardData);

module.exports = router;
