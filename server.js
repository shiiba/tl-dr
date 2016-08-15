// Requirements
const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const webPackMiddleware = require('./tasks.js');
const port = process.env.PORT || 3000;

// Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(webPackMiddleware);

// Database
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/tldr_dev";
mongoose.connect(mongoUri);

// Controllers
const usersController = require('./controllers/users.js');
app.use('/users', usersController);

const authController = require('./controllers/auth.js');
app.use('/auth', authController);

const summaryController = require('./controllers/summary.js');
app.use('/summarize', summaryController);

// Listen
app.listen(port);
console.log('==============');
console.log('listening on port ' + port);
console.log('==============');
