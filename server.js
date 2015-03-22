var express = require('express'),
  mongoose = require('mongoose');

// set NODE_ENV=development
// heroku config:set NODE_ENV=production
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();
var config = require('./server/config/config')[env];
require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app);

app.listen(config.port, function() {
  console.log("Node app is running at port:" + config.port);
});

var keyPattern = /^[a-zA-Z0-9]{16,32}$/;
var booleanPattern = /^[a-z]{4,5}$/;
var beDatePattern = /20\d{2}(-|\/)((0[1-9])|(1[0-2])|([1-9]))(-|\/)(([1-9])|(0[1-9])|([1-2][0-9])|(3[0-1]))/;
var datePattern = /20\d{2}(-|\/)((0[1-9])|(1[0-2])|([1-9]))(-|\/)(([1-9])|(0[1-9])|([1-2][0-9])|(3[0-1]))(T|\s)(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])/;
var onlyNumberPattern = /^[0-9]+$/; 
var numberAndCharPattern = /^[a-zA-Z0-9]+$/;
var battleTypePattern = /([0-9]{0,3}[,]*)*/; 
var idComaPattern = /([0-9]{0,10}[,]*)*/; 

app.get('/test/:param1', function(req, res) {
  var p1 = req.params.param1;
  res.send(p1);
});