const mongoose = require("mongoose");

const projetSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  titre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("projet", projetSchema);
