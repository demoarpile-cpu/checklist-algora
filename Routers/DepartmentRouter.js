const express = require("express");
const { 
    getalldepartment, 
    adddepartment, 
    deletedepartment, 
    updatedepartment 
} = require("../Controllers/DepartmentCtrl.js");
const { authMiddleware } = require("../Middewares/authMiddleware.js");

const router = express.Router();

router.get("/department", getalldepartment);
router.post("/department", adddepartment);
router.put("/department/:id", updatedepartment);
router.delete("/department/:id", deletedepartment);

module.exports = router;
