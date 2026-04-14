const mongoose = require("mongoose");

const SidebarSchema = new mongoose.Schema({
  sidebarName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Sidebar = mongoose.model("Sidebar", SidebarSchema);

module.exports = Sidebar;
