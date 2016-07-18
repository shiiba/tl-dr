// Requirements
var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;

// Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Database
var mongoUri = process.env.MONGODB_URI || "mongodb://localhost/tldr_dev";
mongoose.connect(mongoUri);

// Controllers
var usersController = require('./controllers/users.js');
app.use('/users', usersController);

var authController = require('./controllers/auth.js');
app.use('/auth', authController);

var summaryController = require('./controllers/summary.js');
app.use('/summarize', summaryController);

// Listen
app.listen(port);
console.log('==============');
console.log('listening on port ' + port);
console.log('==============');
