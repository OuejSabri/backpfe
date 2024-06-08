const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
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
