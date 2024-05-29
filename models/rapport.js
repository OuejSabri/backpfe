const mongoose = require("mongoose");

const rapportSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  candidature: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "candidature",
    required: true,
  },
});

module.exports = mongoose.model("rapport", rapportSchema);
