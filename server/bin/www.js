var mongoose = require('mongoose');

var app =require('../app');

var stringConnection = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/sinhblacksite';
mongoose.connect(stringConnection);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});