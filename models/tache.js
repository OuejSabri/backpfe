const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['Todo', 'InProgress', 'Done'], default: 'Todo' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
  candidature: { type: mongoose.Schema.Types.ObjectId, ref: 'candidature', required: false } 
});


module.exports = mongoose.model("tasks", taskSchema);

