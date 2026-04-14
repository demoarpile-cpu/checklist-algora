const mongoose = require('mongoose');

const VehicleTypeSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true, unique: true },
    description: { type: String },
    brand: { type: String },
    model: { type: String },
    color: { type: String },
    year: { type: String },
}, {
    timestamps: true
});

const VehicleType = mongoose.model('VehicleType', VehicleTypeSchema);

module.exports = VehicleType;
