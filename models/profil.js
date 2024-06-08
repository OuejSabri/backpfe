const mongoose = require("mongoose");

const profilSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  nationality: { type: String },
  dateOfBirth: { type: Date},
  address: { type: String },
  department: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  cv: { type: String},
});

module.exports = mongoose.model("profil", profilSchema);
