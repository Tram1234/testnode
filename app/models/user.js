var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



// shema defenition

var userSchema = new mongoose.Schema({
    local          : {
        username        : String,
        password     : String,
    }

});
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


module.exports = mongoose.model('User', userSchema);