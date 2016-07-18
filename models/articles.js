var mongoose = require('mongoose');

// Article schema based on API results from Pocket request
var articleSchema = new mongoose.Schema({
  itemId: Number,
  givenUrl: String,
  givenTitle: String,
  resolvedUrl: String,
  resolvedTitle: String,
  isArticle: Boolean,
  wordCount: Number
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
