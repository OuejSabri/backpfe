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


attestationSchema.statics.createAttestation = async function (attestationData){
  return this.create(attestationData);
}


module.exports = mongoose.model("attestation", attestationSchema);
