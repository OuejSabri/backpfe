const { required, date } = require("joi");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const offreSchema = mongoose.Schema({
  societe: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  titre: { type: String },
  description: { type: String },
  technologies: [{ type: String }],
  lieu: { type: String },
  domaine: { type: String },
  date_dexpiration: { type: Date },
  duree : { type : String},
  number_candidats: { type: Number, min: 0 },
  status: {
    type: String,
    enum: ["indisponible", "disponible"],
    default: "disponible",
  },
  date: { type: Date, default: Date.now },
});

offreSchema.plugin(uniqueValidator);

module.exports = mongoose.model("offre", offreSchema);
