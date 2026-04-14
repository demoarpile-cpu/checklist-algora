const express = require("express");
const { 
    getRoleWithPermissions, 
    createRole, 
    editRole, 
    deleteRole, 
    getPermissionByRoleId, 
    editPermissionsBulk 
} = require("../Controllers/RoleCtrl");
const { authMiddleware } = require("../Middewares/authMiddleware");

const router = express.Router();

router.get("/roles", getRoleWithPermissions);
router.post("/create-role", createRole);
router.patch("/edit-role/:id", editRole);
router.delete("/delete-role/:id", deleteRole); 
router.get("/getpermissions/:roleId", getPermissionByRoleId);
router.put("/update-multiple-permissions", editPermissionsBulk);

module.exports = router;
