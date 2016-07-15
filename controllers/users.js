var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var Article = require('../models/articles.js');
var request = require('request');
var util = require('util');

function deepPrint(x){
  console.log(util.inspect(x, {showHidden: false, depth: null}));
}

// --------------------------
// No Auth Routes
// --------------------------

// create a new user

router.post('/register', (req, res) => {
  console.log('req.body: ' + req.body);
  User.create(req.body, (err, user) => {
    if(err){
      console.log(err);
      res.status(500).end();
    }
    res.send(true);
  });
});

// --------------------------
// Require JWT Token below
// --------------------------
router.use(passport.authenticate('jwt', { session: false }));

// routes


module.exports = router;
