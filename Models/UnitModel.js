const mongoose = require("mongoose");

const { Schema } = mongoose;

const unitsSchema = new Schema(
  {
    unitNumber: {
      type: String,
    },
    plate: {
      type: String,
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    category: {
      type: String,
    },
    color: {
      type: String,
    },
    year: {
      type: Number,
    },
    branchCode: {
      type: String,
    },
    insuranceCompany: {
      type: String,
    },
    insuranceUpload: {
      type: String,
    },
    vehicleCardUpload: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model("Unit", unitsSchema);

module.exports = Unit;
