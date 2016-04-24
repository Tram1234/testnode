var restful = require('node-restful');
var mongoose = restful.mongoose;

//Message schema
var messageSchema = new mongoose.Schema({

    text:String


},{ versionKey: false });

module.exports  = restful.model('message',messageSchema);