var summary = require('node-tldr');

var url = "http://blogs.scientificamerican.com/food-matters/how-the-japanese-diet-became-the-japanese-diet/";

summary.summarize(url, function(result, failure) {
  if (failure) {
      console.log("An error occured! " + result.error);
  }

  console.log("#####################");
  console.log("#### " + result.title);
  console.log("#### Words: " + result.words);
  console.log("#### Compressed by: " + result.compressFactor);
  console.log("#####################");
  console.log(result.summary.join("\n"));

  console.log("#####################");
  console.log("#### Dictionary: ");
  console.log(result.dict);
  console.log("#####################");

});
