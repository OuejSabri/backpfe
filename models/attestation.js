const mongoose = require('mongoose');

const attestationSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  candidature:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'candidature',
    required: true,
  }
});

const Attestation = mongoose.model("attestation", attestationSchema);

module.exports = Attestation;
