var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook');
var User = require('../models/users');
var configAuth = require('./auth.js');

module.exports = function(passport){

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use("google", new GoogleStrategy({
        clientID : configAuth.google.clientID,
        clientSecret: configAuth.google.clientSecret,
        callbackURL : configAuth.google.callbackURL
    },
    function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'google.id' : profile.id}, function(err , user){
                if (err) return done(err);
                if (user) return done(null, user);
                else{
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }
    ));

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebook.clientID,
            clientSecret: configAuth.facebook.clientSecret,
            callbackURL: configAuth.facebook.callbackURL,
            profileFields: ['email', 'displayName']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            process.nextTick(function(){
                User.findOne({"facebook.id" : profile.id}, function(err, user){
                    if (err) return done(err);
                    if (user) return done(null, user);
                    else{
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.name = profile.displayName;
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.save(function(err){
                            if(err) return err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));

};