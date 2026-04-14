const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "company name is required."],
      unique: [true, "Category name must be unique."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const category = mongoose.model("company", categorySchema);

module.exports = category;
