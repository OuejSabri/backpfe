const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
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