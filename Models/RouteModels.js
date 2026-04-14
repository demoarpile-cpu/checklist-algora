const mongoose = require("mongoose");

const { Schema } = mongoose;

const routeSchema = new Schema(
  {
    routeNumber: {
      type: String,
    },
    branchCode: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
    },
    economicNumber: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    username: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
    },
  },
  {
    timestamps: true,
  }
);

const route = mongoose.model("routes", routeSchema);

module.exports = route;
