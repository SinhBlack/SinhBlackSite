var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = Schema({
    local:{
        email: String,
        password: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    google:{
        id: String,
        token: String,
        name: String,
        email: String
    },
    facebook:{
        id: String,
        token: String,
        name: String,
        email: String
    }
});

userSchema.pre('save', function(next){
    var user = this;
    var SALT_FACTOR = 5;

    if(!user.isModified('local.password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.local.password, salt, null, function(err, hash){
            if (err) return next(err);
            user.local.password = hash;
            next();
        });
    });

});

userSchema.methods.comparePassword = function(candidatePassword, done){
  bcrypt.compare(candidatePassword, this.local.password, function(err, isMatch){
      if (err) return done(err);
      done(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);