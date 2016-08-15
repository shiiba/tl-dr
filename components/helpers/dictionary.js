import _ from 'underscore';

// Converts TF-IDF algorithm output ('sentence': 'score'), to correctly named k:v pairs (uses underscore.js)
export function setDictObjs(dictionary){
  let tmp = _.mapObject(dictionary, (val, key) => {
    return({
      'sentence': key,
      'score': val
    });
  })
  return tmp;
};

// Creates an array of objects out of a nested object
export function createArray(dictionary) {
  let tmp = [];
  _.each(dictionary, (obj) => {
    tmp.push(obj);
  });
  return tmp;
};

// Finds the min and max score of sentences and returns them
function minAndMax(dictionary) {
  let min, max = 0;
  max = _.max(dictionary, (sent) => { return sent.score }).score;
  min = _.min(dictionary, (sent) => { return sent.score }).score;
  return { max: max, min: min };
}

// Normalizes the scores on a scale of 0 to 1 and add it to the object
export function normalize(dictionary) {
  let minMax = minAndMax(dictionary);
  let normalized = _.map(dictionary, (obj) => {
    let norm = ((obj['score'] - minMax.min) / (minMax.max - minMax.min));
    let normScore = { 'normScore': norm };
    return _.extend(obj, normScore);
  });
  return normalized;
};
