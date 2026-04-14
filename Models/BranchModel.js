const mongoose = require("mongoose");

const { Schema } = mongoose;

const BranchSchema = new Schema(
  {
    branchAddress: {
      type: String,
      // required: [true, "Branch address is required."],
    },
    branchCode: {
      type: String,
      // required: [true, "Branch code is required."],
    },
    branchDetails: {
      type: String,
      // required: [true, "Branch details are required."],
    },
    branchName: {
      type: String,
      // required: [true, "Branch name is required."],
    },
    country: {
      type: String,
      // required: [true, "Country is required."],
    },
    state: {
      type: String,
      // required: [true, "State is required."],
    },
  },
  {
    timestamps: true,
  }
);

const Branch = mongoose.model("Branch", BranchSchema);

module.exports = Branch;
