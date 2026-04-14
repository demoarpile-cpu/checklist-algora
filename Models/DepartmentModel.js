const mongoose = require("mongoose");

const { Schema } = mongoose;

const Schemas = new Schema(
  {
    departmentName: {
      type: String,
      required: [true, "departmentName name is required."],
      unique: [true, "departmentName name must be unique."],
    },
  },
  {
    timestamps: true,
  }
);

const category = mongoose.model("Department", Schemas);

module.exports = category;
