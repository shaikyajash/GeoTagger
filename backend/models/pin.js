const mongoose = require("mongoose");

const User = require("./user");


const pinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description: { type: String, default: "" },
  placeName: { type: String, default: "Unknown Location" },
},{timestamps: true});


module.exports = mongoose.model("Pin", pinSchema);
