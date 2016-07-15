var express = require('express');
var router = express.Router();
var summary = require('node-tldr');
var util = require('util');

function deepPrint(x){
  console.log(util.inspect(x, {showHidden: false, depth: null}));
}

router.post('/', function(req, res) {
  // console.log(req.body);
  console.log('==============================');
  console.log('post route hit');
  console.log('calling summary on this url: ');
  console.log(req.body.url);
  var url = req.body.url;
  summary.summarize(url, function(result, failure) {
    if (failure) {
        console.log("An error occured! " + result.error);
    }
    // deepPrint(result);
    res.json(result);
  });
  
});

module.exports = router;
