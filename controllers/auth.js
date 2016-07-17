var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var Article = require('../models/articles.js');
var request = require('request');
var jwt = require('jsonwebtoken');

// initialize passport
router.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// router.get('/', (req, res) => {
//   res.send('testing if the auth.js route works');
// });

// login post requtest, returning JWT Token on success
router.post('/', passport.authenticate('local', { session: false }), (req, res, next) => {
  console.log('==========================');
  console.log('req.body: ' + req.body);
  console.log('==========================');

  var token = jwt.sign(req.user, process.env.JWT_SECRET, {
    expiresIn: 1400
  });

  var userId = req.user._id;
  console.log('userId: ' + userId);

  console.log(token);
  res.json({ 
    token: token, 
    userId: userId
  });
});

// pocket routes
router.get('/pocket',passport.authenticate('pocket'), (req, res) => {
  // The request will be redirected to Pocket for authentication, so this
  // function will not be called.
});

router.get('/pocket/callback', passport.authenticate('pocket', { failureRedirect: '/login' }), (req, res) => {
  // console.log('req.session.pocketData.accessToken:');
  // console.log(req.session.pocketData.accessToken);
  // console.log(req.cookies.userId);

  User.findById(req.cookies.userId)
  .then(function(user){
    console.log(user);
    user.pocketToken = req.session.pocketData.accessToken;
    user.save(function(err){
      if(err){
        console.log(err);
        res.send(false);
      } else {
        console.log('user auth token saved!');
        res.redirect('/');
      }
    });
  });
});

module.exports = router;

