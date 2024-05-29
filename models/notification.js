const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    type : { type : String , required : true},
    description : { type : String , required : true},
    // viewers : { type : mongoose.Types.ObjectId, ref: 'User' }, 

});
module.exports = mongoose.model('notification', notificationSchema);
