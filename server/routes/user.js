var User = require('../models/users');
var helpers = require('../helpers/helpers');

var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var auth = require('../config/auth');

module.exports = function(app, passport){
    app.post('/auth/signup', function(req, res){
        User.findOne({'local.email' : req.body.email}, function(err, exitUser){
            if(exitUser){
                res.status(409).send({message: "Email already taken!"});
            }else{
                var newUser = User();
                newUser.local.email = req.body.email;
                newUser.local.password = req.body.password;

                newUser.save(function(){
                    res.send({token: helpers.createJWT(newUser)});
                });
            }
        });
    });

    app.post('/auth/signin', function(req, res){
        User.findOne({'local.email' : req.body.email}, function(err, user){
            if(!user){
                res.status(401).send({message: "Invalid email or password"});
            }else{
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch){
                        res.send({token: helpers.createJWT(user)});
                    }else{
                        res.status(401).send({message: "Invalid email or password"});
                    }
                });
            }
        });
    });

    app.get('/api/profile', helpers.ensureAuth ,function(req, res){
        if(req.userId){
            User.findById(req.userId, function(err, user){
                res.send(user);
            });
        }else{
            res.send(req.user);
        }
    });

    app.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
    app.get('/auth/google/callback',
        passport.authenticate('google', {session : true}),
        function(req, res){
            res.redirect('/#/profile');
        }
    );

    app.get('/auth/facebook', passport.authenticate('facebook', {scope : ['email']}));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/#/profile',
            failureRedirect: '/login' }));

    app.get('/logout', function(req, res){
        req.logout();
        res.status(200).send({message: "Loged out"});
    });

    app.get('/auth/isAuth', function(req, res){
        if(req.isAuthenticated()){
            res.send({isAuth: true});
        }else{
            res.send({isAuth: false});
        }
    });

    /*FORGOT PASSWORD*/
    app.post('/api/forgot', function(req, res){
        async.waterfall([
            function(done){
                crypto.randomBytes(20, function(err, buf){
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done){
                User.findOne({'local.email' : req.body.email}, function(err, user){
                    if(!user) res.status(409).send({message: "No account with that email already exits!"});
                    else{
                        user.local.resetPasswordToken = token;
                        user.local.resetPasswordExpires = Date.now() + 3600000;

                        user.save(function(err){
                            done(err, token, user);
                        });

                    }
                });
            },
            function(token, user){
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: auth.mailSend.user,
                        pass: auth.mailSend.password
                    }
                });

                var mailOptions = {
                    from: 'sinhblack.com',
                    to: user.local.email, // list of receivers
                    subject: 'Password reset', // Subject line
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                    res.status(200).send(200);
                });
            }
        ]);
    });

    app.get('/reset/:token', function(req, res){
        User.findOne({ "local.resetPasswordToken" : req.params.token,
                       "local.resetPasswordExpires" : {$gt : Date.now()}}, function(err, user){
            if(!user){
                res.status(406).send({message : "Password reset token is invalid or has expired!"});
            }else{
                res.status(200).send(200);
            }
        });
    });

    app.post('/reset/:token', function(req, res){
        async.waterfall([
            function(done){
                User.findOne({ "local.resetPasswordToken" : req.params.token,
                    "local.resetPasswordExpires" : {$gt : Date.now()}}, function(err, user){

                    if(!user){
                        res.status(406).send({message : "Password reset token is invalid or has expired!"});
                    }else{

                        user.local.password = req.body.password;
                        user.local.resetPasswordExpires = undefined;
                        user.local.resetPasswordToken = undefined;

                        user.save(function(err){
                            done(err, user);
                        });
                    }
                });
            },

            function(user){
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: auth.mailSend.user,
                        pass: auth.mailSend.password
                    }
                });

                var mailOptions = {
                    from: 'sinhblack.com',
                    to: user.local.email, // list of receivers
                    subject: "Your password has been changed!",
                    text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
                };

               transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                    res.status(200).send({message: "Your password has been changed!"});
                });
            }
        ]);
    });

};


