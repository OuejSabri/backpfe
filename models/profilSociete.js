const mongoose = require("mongoose");

const profilSocieteSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user" },
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
});
module.exports = mongoose.model("profileSociete", profilSocieteSchema);
