var message = require('../app/models/message');

module.exports = function(app){

   message.methods(['get','put','post','delete']);
    message.register(app ,'/chatapi');



};



