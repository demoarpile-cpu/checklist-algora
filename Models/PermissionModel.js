const mongoose = require("mongoose");
const Sidebar = require("./SidebarModel.js"); // import Sidebar here

const { Schema } = mongoose;

const PermissionSchema = new Schema({
  sidebarId: {
    type: Schema.Types.ObjectId,
    ref: 'Sidebar',
    required: true,
  },
  subSidebar: {
    type: String,
    required: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  isCreate: {
    type: Boolean,
    default: false,
  },
  isGet: {
    type: Boolean,
    default: false,
  },
  permission: {
    type: Boolean,   // Boolean type
    default: true,   // optional
  },
  roleId: {
    type: String
  }
});

const Permission = mongoose.model('Permission', PermissionSchema);

module.exports = Permission;
