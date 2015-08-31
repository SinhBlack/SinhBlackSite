var User = require('../models/users');
var helpers = require('../helpers/helpers');

module.exports = function(app, passport){
    app.post('/auth/signup', function(req, res){
        User.findOne({'local.email' : req.body.email}, function(err, exitUser){
            if(exitUser){
                res.status(409).send({message: "Email already taken!"});
            }

            var newUser = User();
            newUser.local.email = req.body.email;
            newUser.local.password = req.body.password;

            newUser.save(function(){
                res.send({token: helpers.createJWT(newUser)});
            });
        });
    });

    app.post('/auth/signin', function(req, res){
        User.findOne({'local.email' : req.body.email, 'local.password' : req.body.password}, function(err, user){
            if(!user){
                res.status(401).send({message: "Invalid email or password"});
            }else{
                res.send({token: helpers.createJWT(user)});
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
        res.send(200);
    });
};


