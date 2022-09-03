/* eslint-disable no-plusplus */
const { readFile } = require('../utils/helpers');

const testData = readFile('public/data/TestData.json');

const { wordList, scoresList } = testData;

//function takes a list and return random item
function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}
//function takes a list and separate it to sublist based on it's category
function getSperatedList(list, category) {
  return list.filter((item) => item.pos === category);
}
//sorting based on id
function sorter(left, right) {
  if (left.id === 0) return -1;
  if (right.id === 0) return 1;
  return left.id < right.id ? -1 : 1;
}

function getRandom(lst, size) {
  const randomList = [];

  //get seprated lists of verb adverb noun adjective
  const verb = getSperatedList(lst, 'verb');
  const adverb = getSperatedList(lst, 'adverb');
  const noun = getSperatedList(lst, 'noun');
  const adjective = getSperatedList(lst, 'adjective');

  //push random item to the main list ot make sure that includes at least 1 adjective, 1 adverb, 1 noun, and 1 verb.
  const randomVerb = getRandomItem(verb);
  const randomAdverb = getRandomItem(adverb);
  const randomNoun = getRandomItem(noun);
  const randomAdjective = getRandomItem(adjective);
  randomList.push(randomVerb, randomAdverb, randomNoun, randomAdjective);

  //continue to push random items until reach the required size
  for (let i = 0; randomList.length < size; i++) {
    const randomItem = getRandomItem(lst);
    const existingItem = randomList.find((item) => item.id === randomItem.id);
    if (!existingItem) {
      randomList.push(randomItem);
    }
  }
  //retun random sorted list
  return randomList.sort(sorter);
}

exports.getWords = (req, res, next) => {
  const randomTenWords = getRandom(wordList, 10);
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: randomTenWords.length,
    data: {
      data: randomTenWords,
    },
  });
};

function roundToNarestHundredth(num) {
  const multiplier = 10 ** 2;
  return Math.round(num * multiplier) / multiplier;
}

//function takes score find number of below that score in scoresList and return it's rank percentage
function getRank(score) {
  const numOfRankBelowScore = scoresList.filter((item) => item < score);
  const rank = (numOfRankBelowScore.length / scoresList.length) * 100;
  return roundToNarestHundredth(rank);
}

exports.getRank = (req, res, next) => {
  const { score } = req.body;
  const rank = getRank(score);
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      rank,
    },
  });
};
