const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
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

const Assignment = mongoose.model("assignment", assignmentSchema);

module.exports = Assignment;
