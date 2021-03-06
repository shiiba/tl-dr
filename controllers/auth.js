'use strict';
const express = require('express');
const router = express.Router();
const session = require('express-session');
const passport = require('../config/passport.js');
const User = require('../models/users.js');
const Article = require('../models/articles.js');
const request = require('request');
const jwt = require('jsonwebtoken');

// Initializes Passport
router.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Login POST request, returning signed JWT Token on success
router.post('/', passport.authenticate('local', { session: false }), (req, res, next) => {
  console.log('==========================');
  console.log('req.body: ' + req.body);
  console.log('==========================');

  let token = jwt.sign(req.user, process.env.JWT_SECRET, {
    expiresIn: 1400
  });

  let userId = req.user._id;
  console.log('userId: ' + userId);

  console.log(token);
  res.json({ 
    token: token, 
    userId: userId
  });
});

// Pocket route to initialize Pocket OAuth flow
router.get('/pocket',passport.authenticate('pocket'), (req, res) => {
  // The request will be redirected to Pocket for authentication, so this
  // function will not be called.
});

// Pocket route that saves the returned Pocket access token on the last step of OAuth
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

