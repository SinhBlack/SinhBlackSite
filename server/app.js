var express = require('express'),
	bodyParser = require('body-parser');
	morgan= require('morgan');
	passport = require('passport');
	session = require('express-session');

var app = express();

app.use(express.static(__dirname + '/../' + 'client'));
app.set('view engine', 'ejs');

app.use(session({secret : "sinhblack",
	saveUninitialized : true,
	resave : true,
	cookie : {
		maxAge: 5000000
	}

}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.get('/', function(req, res){
	res.sendfile('index.html');
});

require('./config/passport')(passport);
require('./routes/user')(app, passport);


module.exports = app;
