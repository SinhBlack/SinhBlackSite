var jwt = require('jsonwebtoken');
var config = require('../config/config');

module.exports = {
    "createJWT" : createJWT,
    "ensureAuth" : ensureAuth
};

function createJWT(user){
    var payload = {
        userId : user._id
    };
    return jwt.sign(payload, config.secretKey);
}

function ensureAuth(req, res, next){

    if(req.headers.authorization || req.isAuthenticated()){
        if(req.headers.authorization){
            var token = req.headers.authorization;

            var payload = jwt.verify(token, config.secretKey);
            req.userId = payload.userId;
            next();
        }

        if (req.isAuthenticated()){
            next();
        }

    }
    else{
        res.status(401).send({message: "Please make sure your request has Authorization header"});
    }
}
