var User = require('../models/users.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtOpts = {};
var PocketStrategy = require('passport-pocket');
var POCKET_CONSUMER_KEY = process.env.POCKET_KEY;

var util = require("util");
JwtOpts.jwtFromRequest = (req) => {
  var token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt_token'];
  }
  return token;
};

JwtOpts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(JwtOpts, (jwt_payload, done) => {
  console.log( "JWT PAYLOAD" + util.inspect(jwt_payload));

  User.findOne({username: jwt_payload._doc.username}, (err, user) => {

      if (err) {
          return done(err, false);
      }

      if (user) {
          console.log("user is " + user.username)
          done(null, user);
      } else {
          done(null, false);
      }
  });
}));

passport.use( new LocalStrategy(
  (username, password, done ) => {
    console.log('we out here fam')
    User.findOne({ username: username }, ( err, dbUser ) => {
      if (err) { 
        console.log('don work fam');
        return done(err); }
      if (!dbUser) {
        return done(null, false);
      }

      if (!dbUser.authenticate(password)) {
        return done(null, false);
      }

      return done(null, dbUser);
    });
  })
);

// Pocket Passport Setup
passport.use( new PocketStrategy({
    consumerKey    : POCKET_CONSUMER_KEY,
    callbackURL    : "http://127.0.0.1:3000/auth/pocket/callback"
  }, (username, accessToken, done) => {
    process.nextTick(() => {
        return done(null, {
            username    : username,
            accessToken : accessToken
        });
    });
  }
));

module.exports = passport;
