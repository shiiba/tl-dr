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
      

//       // var returnedSongs = [];
//       // for(var i = 0; i < results.items.length; i++){
//       //   var song = new Songs({
//       //     videoId: results.items[i].id.videoId,
//       //     title: results.items[i].snippet.title,
//       //     img: results.items[i].snippet.thumbnails.default.url
//       //   });
//       //   returnedSongs.push(song);
//     }
// });


module.exports = router;
