const mongoose = require("mongoose");
const CVSchema = new mongoose.Schema({
  education: [{ type: mongoose.Types.ObjectId, ref: "education" }],
  experience: [{ type: mongoose.Types.ObjectId, ref: "experience" }],
  projet: [{ type: mongoose.Types.ObjectId, ref: "projet" }],
  competence: [{ type: mongoose.Types.ObjectId, ref: "skill" }],
  certification: [{ type: mongoose.Types.ObjectId, ref: "certification" }],
});

CVSchema.statics.createCV = async function (cvData) {
  return this.create(cvData);
};
module.exports = mongoose.model("cv", CVSchema);
