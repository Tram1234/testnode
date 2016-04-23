var mongoose = require('mongoose');


var messageSchema = new mongoose.Schema({
    chatMessage:{
        type:String,
        requiired:true
    },


});

module.exports = mongoose.model('Message',messageSchema);