const mongoose = require("mongoose");

const candidatureSchema = new mongoose.Schema({
  stagiaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  nom: { type: String },
  email: { type: String },
  cv: { type: String, required: true },
  lettre_motivation: { type: String, required: true },
  date_debut: { type: Date },
  date_fin: { type: Date },
  datePostulation: { type: Date, default: Date.now() },
  status: {
    type: String,
    num: ["refuser", "en_attente", "accepter"],
    default: "en_attente",
  },
  offreStage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "offre",
  },
});

module.exports = mongoose.model("candidature", candidatureSchema);
