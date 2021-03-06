'use strict';
const express = require('express');
const router = express.Router();
const passport = require('../config/passport.js');
const User = require('../models/users.js');
const Article = require('../models/articles.js');
const request = require('request');
const util = require('util');
const _ = require('underscore')._;
const pocketUrl = 'https://getpocket.com/v3/get';

// Allows for inspection of normally printed [Object: Object]s
function deepPrint(x){
  console.log(util.inspect(x, {showHidden: false, depth: null}));
};

// Creates array of objects from nested objects
function createArray(object) {
  let tmp = [];
  _.each(object, (obj) => {
    tmp.push(obj);
  });
  return tmp;
};

// Creates takes in articles object array, instantiates new article objects, 
// and returns the new array
function createArticles(articles) {
  let tmp = [];
  _.each(articles, (article) => {
    console.log(article);
    let item = new Article({
      itemId: article.item_id,
      givenUrl: article.given_url,
      givenTitle: article.given_title,
      resolvedUrl: article.resolved_url,
      resolvedTitle: article.resolved_title,
      isArticle: article.is_article,
      wordCount: article.word_count
    });
    tmp.push(item);
  });
  return tmp;
};

// --------------------------
// No Auth Routes
// --------------------------

// Create a new user
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
// router.use(passport.authenticate('jwt', { session: false }));

// Checks if the user has a Pocket Token already
router.get('/pocket_auth', (req, res) => {
  User.findById(req.cookies.userId).then(function(user){
    if(user.pocketToken) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

// Queries Pocket API for a user's latest 30 articles, and saves them to the DB
router.get('/pocket_articles', (req, res) => {
  User.findById(req.cookies.userId).then(function(user){
    let accessToken = user.pocketToken;

    request(pocketUrl + "?consumer_key=" + process.env.POCKET_KEY + "&access_token=" + accessToken + "&contentType=article&state=unread&count=30", function(error, response, body) {
      if(!error && response.statusCode == 200) {
        let results = JSON.parse(body);
        let returnedArticles = createArticles(createArray(results.list));
        User.findOneAndUpdate({_id: req.cookies.userId}, {$set:{articles: returnedArticles}}, function(err, user){
          if(err){
            console.log(err);
          } else {
            console.log('saved pocket articles');
          }
          res.redirect('/');
        });
      }
    });
  });
});

// Returns a user's articles from the DB
router.get('/articles', (req, res) => {
  User.findById(req.cookies.userId).then(function(user){
    res.json(user.articles);
  });
});

module.exports = router;
