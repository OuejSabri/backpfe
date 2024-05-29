const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
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
