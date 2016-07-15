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

// ------------------------------
// ROUTES THAT DON'T REQUIRE AUTH
// ------------------------------

// CREATE A NEW USER

router.post('/register', function(req, res){
  console.log('req.body: ' + req.body);
  User.create(req.body, function(err, user){
    if(err){
      console.log(err);
      res.status(500).end();
    }
    res.send(true);
  });
});

// -----------------------------------------------
// ROUTES THAT REQUIRE AUTHENTICATION w/ JWT BELOW
// -----------------------------------------------
router.use(passport.authenticate('jwt', { session: false }));


module.exports = router;

