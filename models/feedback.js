const mongoose = require('mongoose');

 const feedbackSchema = new mongoose.Schema({
   //  user : { type : mongoose.Types.ObjectId, ref: 'User' }, 
    nom: { type: String, required: true },
    email:{type: String, required: true},
    commentaire: { type: String, required: true },
    date: { type: Date, default: Date.now() }
 });


module.exports = mongoose.model("feedBack", feedbackSchema);
