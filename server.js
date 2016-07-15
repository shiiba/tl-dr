// requirements
var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
// var _ = require('underscore')._;
// var browserify = require('browserify');
var ejs = require('ejs');
var port = process.env.PORT || 3000;

// middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// database
// var mongoUri = process.env.MONGODB_URI || "mongodb://localhost/tldr_dev";
// mongoose.connect(mongoUri);

// controllers
var summaryController = require('./controllers/summary.js');
app.use('/summarize', summaryController);

var extAuthController = require('./controllers/ext_auth.js');
app.use('/auth', extAuthController);

// listen
app.listen(port);
console.log('==============');
console.log('listening on port ' + port);
console.log('==============');
