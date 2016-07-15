var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var jwt = require('jsonwebtoken');

// initialize passport
router.use(passport.initialize());

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

module.exports = router;

