'use strict';
const express = require('express');
const router = express.Router();
const summary = require('node-tldr');
const util = require('util');

// function deepPrint(x){
//   console.log(util.inspect(x, {showHidden: false, depth: null}));
// }

// Calls summarize on the submitted URL via the modified node-tldr module
router.post('/', function(req, res) {
  // console.log(req.body);
  console.log('==============================');
  console.log('post route hit');
  console.log('calling summary on this url: ');
  console.log(req.body.url);
  const url = req.body.url;
  summary.summarize(url, function(result, failure) {
    if (failure) {
        console.log("An error occured! " + result.error);
    }
    // deepPrint(result);
    res.json(result);
  });
  
});

module.exports = router;
