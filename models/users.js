var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var articleSchema = require('./articles.js').schema;

var UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, require: true },
  password: String,
  pocketToken: String,
  articles: [articleSchema]
});

// Hash user's password before saving it to the DB
UserSchema.pre('save', function(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

// Checks login password with one stored in DB
UserSchema.methods.authenticate = function(passwordTry) {
  return bcrypt.compareSync(passwordTry, this.password);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
