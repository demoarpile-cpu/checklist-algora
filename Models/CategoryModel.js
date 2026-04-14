const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    categoryname: {
      type: String,
      required: [true, "Category name is required."],
      unique: [true, "Category name must be unique."],
    },
    // createdBy: {
    //   type: String,
    //   required: [true, "Creator is required."],
    // },
  },
  {
    timestamps: true,
  }
);

const category = mongoose.model("category", categorySchema);

module.exports = category;
