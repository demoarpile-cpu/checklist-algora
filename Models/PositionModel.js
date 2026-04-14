const mongoose = require("mongoose");

const { Schema } = mongoose;

const positionSchema = new Schema(
  {
    positionName: {
      type: String,
      required: [true, "positionName name is required."],
      unique: [true, "positionName name must be unique."],
    },
  },
  {
    timestamps: true,
  }
);

const category = mongoose.model("Position", positionSchema);

module.exports = category;
