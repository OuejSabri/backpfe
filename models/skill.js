const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  nom: {
    type: String,
    required: true,
  },
  niveau: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("skill", skillSchema);
