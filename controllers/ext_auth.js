// requirements
var express = require('express');
var router = express.Router();
var request = require('request');
var util = require('util');
var pocketUrl = 'https://getpocket.com/v3/oauth/request';

function deepPrint(x){
  console.log(util.inspect(x, {showHidden: false, depth: null}));
}

// router.post('/pocket_auth', (req,res) => {
//   request(pocketUrl + , (error, response, body) => {
//     if(!error && response.statusCode == 200){
//       results = JSON.parse(body);
      
//       console.log('auth request hit!);

//     }
// });


module.exports = router;
