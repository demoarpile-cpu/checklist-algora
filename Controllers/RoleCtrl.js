const Schema = require("../Models/RoleModel");
const asyncHandler = require('express-async-handler');
const Permission = require("../Models/PermissionModel");
const mongoose = require('mongoose');

// GET all roles
const getRoleWithPermissions = asyncHandler(async (req, res) => {
    try {
        const data = await Schema.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(404).json(error.message);
    }
});

// CREATE role
const createRole = asyncHandler(async (req, res) => {
    try {
        const { roleName, description } = req.body;
        if (!roleName || !description) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const existingRole = await Schema.findOne({ roleName });
        if (existingRole) {
            return res.status(400).json({ message: "Role already exists" });
        }

        const roles = await Schema.create({ roleName, description });

        const permissionTemplate = [
            { sidebarId: "683d7168bcb71900b5cb2141", subSidebar: null, isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2142", subSidebar: null, isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2143", subSidebar: "VehicleType", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2143", subSidebar: "vehicleDivision", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2143", subSidebar: "Insurance", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2143", subSidebar: "vehicle", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2144", subSidebar: "Position", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2144", subSidebar: "Department", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2144", subSidebar: "Driver", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2144", subSidebar: "DriverList", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2145", subSidebar: null, isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2146", subSidebar: "CreateChecklist", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2146", subSidebar: "Checklist", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2146", subSidebar: "FilledChecklist", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2147", subSidebar: "BranchChecklist", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2147", subSidebar: "RouteChecklist", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2147", subSidebar: "EconomicunitChecklist", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2147", subSidebar: "AnswerChecklist", isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
            { sidebarId: "683d7168bcb71900b5cb2148", subSidebar: null, isEdit: true, isDelete: true, isCreate: true, isGet: true, permission: true },
        ];

        const permission = permissionTemplate.map(p => ({ ...p, roleId: roles._id }));
        const RolePermission = await Permission.insertMany(permission, { ordered: true });

        res.status(200).json({ roles, message: "Role created successfully", success: true, RolePermission });
    } catch (error) {
        res.status(404).json(error.message);
    }
});

// EDIT role
const editRole = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { roleName, description } = req.body;
        if (!roleName) return res.status(400).json({ message: "Please fill all the fields" });

        const existingRole = await Schema.findById(id);
        if (!existingRole) return res.status(404).json({ message: "Role not found" });

        existingRole.roleName = roleName;
        existingRole.description = description;
        const updatedRole = await existingRole.save();
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(404).json(error.message);
    }
});

// DELETE role
const deleteRole = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const existingRole = await Schema.findById(id);
        if (!existingRole) return res.status(404).json({ message: "Role not found" });

        await Schema.findByIdAndDelete(id);
        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(404).json(error.message);
    }
});

// GET permissions by roleId
const getPermissionByRoleId = asyncHandler(async (req, res) => {
    try {
        const { roleId } = req.params;
        if (!roleId) return res.status(400).json({ message: "Role ID is required" });

        const permissions = await Permission.find({ roleId })
            .populate({ path: 'sidebarId', select: 'sidebarName' });

        const formattedPermissions = permissions.map(p => ({
            _id: p._id,
            sidebarName: p.sidebarId.sidebarName,
            subSidebar: p.subSidebar,
            isEdit: p.isEdit,
            isDelete: p.isDelete,
            isCreate: p.isCreate,
            isGet: p.isGet,
            permission: p.permission,
            roleId: p.roleId
        }));

        res.status(200).json({ message: "Permissions fetched successfully", success: true, data: formattedPermissions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// BULK update permissions
const editPermissionsBulk = asyncHandler(async (req, res) => {
    try {
        const updates = req.body;
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ message: "Invalid input data", success: false });
        }

        const bulkOps = updates.map(item => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(item._id) },
                update: { $set: { 
                    isEdit: item.isEdit, 
                    isDelete: item.isDelete, 
                    isCreate: item.isCreate, 
                    isGet: item.isGet, 
                    permission: item.permission 
                }}
            }
        }));

        const result = await Permission.bulkWrite(bulkOps);

        res.status(200).json({
            message: `${result.modifiedCount} permissions updated successfully`,
            success: true,
            result
        });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});

module.exports = {
    getRoleWithPermissions,
    createRole,
    editRole,
    deleteRole,
    getPermissionByRoleId,
    editPermissionsBulk
};
