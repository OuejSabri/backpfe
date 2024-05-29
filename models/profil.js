const mongoose = require("mongoose");

const profilSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user" },
  cin: { type: String },
  prenom: { type: String },
  date_naissance: { type: Date },
  sexe: { type: String, enum: ["homme", "femme"] },
  adresse: { type: String },
  ville: {
    type: String,
  },
  matricule_fiscale: { type: String },
  domaine: { type: String },
  code_postal: { type: String },
  fax: { type: String },
  site_web: { type: String },
  description: { type: String },
  // cv: { type: mongoose.Types.ObjectId, ref: 'cv', allowNull: true },
  cv:{type: String},
  etablissement: { String },
});
module.exports = mongoose.model("profil", profilSchema);
