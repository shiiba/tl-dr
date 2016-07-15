var mongoose = require('mongoose');

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
