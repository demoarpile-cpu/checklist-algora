const mongoose = require("mongoose");

const { Schema } = mongoose;

const RolesSchema = new Schema(
  {
    roleName: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Roles", RolesSchema);

module.exports = Role;
