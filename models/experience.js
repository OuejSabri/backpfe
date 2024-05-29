const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  entreprise: {
    type: String,
    required: true,
  },
  poste: {
    type: String,
    required: true,
  },
  dateDebut: {
    type: Date,
    required: true,
  },
  dateFin: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
});

// Ajoutez la méthode statique `createExperience` au schéma
experienceSchema.statics.createExperience = async function (experienceData) {
  return this.create(experienceData);
};

module.exports = mongoose.model("experience", experienceSchema);
