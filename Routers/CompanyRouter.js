const express = require("express");
const { authMiddleware } = require("../Middewares/authMiddleware");
const {
  getallCompany,
  addCompany,
  getallCompanyName,
  updateCompany,
  deleteCompany,
} = require("../Controllers/CompanyCtrl");

const router = express.Router();

router.get("/insurance-company", authMiddleware, getallCompany);
router.get("/getallcompany", authMiddleware, getallCompanyName);
router.post("/insurance-company", authMiddleware, addCompany);
router.put("/insurance-company/:id", authMiddleware, updateCompany);
router.delete("/insurance-company/:id", authMiddleware, deleteCompany);

module.exports = router;
