const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  institut: {
    type: String,
    required: true,
  },
  domaineEtude: {
    type: String,
    required: true,
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("education", educationSchema);
