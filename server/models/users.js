var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    local:{
        email: String,
        password: String
    },
    google:{
        id: String,
        token: String,
        name: String,
        email: String
    }
});

module.exports = mongoose.model('User', userSchema);