const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("certification", certificationSchema);


