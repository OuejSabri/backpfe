const { required } = require('joi');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const postulerSchema = new mongoose.Schema({
    user : { type : mongoose.Types.ObjectId, ref: 'user' }, 
    nom : {type : String, required : true},
    email : {type : String, required : true},
    cv : {type : String, required  : true} ,
    lettre_motivation : {type : String, required : true},
    date_debut : {type : Date,},
    date_fin : {type : Date,},
    datePostulation: {type : Date, default: Date.now()},
    status : {type : String, num : ['refuser','en_attente','accepter'], default: "en_attente"},
});

module.exports = mongoose.model('post', postulerSchema);