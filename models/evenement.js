const mongoose = require('mongoose');


const evenementSchema = mongoose.Schema({
    // owner :{ type : mongoose.Types.ObjectId, ref: 'Societe' }, 
	nom : { type : String , required : true},
	description : { type : String , required : true},
	// date : { type : Date , required : true},
    // adresse : { type : String , required : true},
    // photos : { type : Image , required : true},
});


module.exports = mongoose.model('evenement', evenementSchema);