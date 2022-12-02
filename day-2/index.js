import assert from "node:assert/strict";
import "../lib.js";
import { testInput, input } from "./input.js";

const scores = {
  A: 1,
  X: 1,
  B: 2,
  Y: 2,
  C: 3,
  Z: 3,
  lost: 0,
  draw: 3,
  won: 6,
};

const flipKeys = (obj) =>
  Object.keys(obj).reduce((newObj, key) => {
    newObj[obj[key]] = key;
    return newObj;
  }, {});

const win = {
  X: "C", // rock X beats scissors C
  Y: "A", // paper Y beats rock A
  Z: "B", // scissors Z beats paper B
};
const win2 = flipKeys(win);

const lose = {
  X: "B",
  Y: "C",
  Z: "A",
};
const lose2 = flipKeys(lose);

const draw = {
  X: "A",
  Y: "B",
  Z: "C",
};
const draw2 = flipKeys(draw);

/**
 * Convert the string input into an array of tuples and use the getScore function to get score of
 * each round, then retun it all summed up
 * @param {string} input
 * @param {(round: [string, string]) => number} getScore
 */
function getScores(input, getScore) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(" "))
    .map((pair) => getScore(pair))
    .sum();
}

/**
 * @param {[string, string]} round
 * @returns {number}
 */
function scorePart1([them, you]) {
  if (win[you] === them) {
    return scores[you] + scores.won;
  }
  if (lose[you] === them) {
    return scores[you] + scores.lost;
  }
  if (draw[you] === them) {
    return scores[you] + scores.draw;
  }
}

// test
assert.equal(getScores(testInput, scorePart1), 15);
// show result
console.log("Result 1:", getScores(input, scorePart1));
// test with final data to make sure refactoring didn't break anything
assert.equal(getScores(input, scorePart1), 10816);

/*
 X means you need to lose, 
 Y means you need to end the round in a draw
 Z means you need to win. 
*/

/**
 * @param {[string, string]} round
 * @returns {number}
 */
function scorePart2([them, you]) {
  if (you === "X") {
    // them = A, to lose I play Z
    // them = B, to lose I play X
    // them = C, to lose I play Y
    const myPlay = lose2[them];
    return scores[myPlay] + scores.lost;
  }
  if (you === "Y") {
    // them = A, to draw I play X
    // them = B, to draw I play Y
    // them = C, to draw I play Z
    const myPlay = draw2[them];
    return scores[myPlay] + scores.draw;
  }

  // them = A, to win I play Y
  // them = B, to win I play Z
  // them = C, to win I play X
  const myPlay = win2[them];
  return scores[myPlay] + scores.won;
}

// test
assert.equal(getScores(testInput, scorePart2), 12);
// get result
console.log("Result 2:", getScores(input, scorePart2));
// test with final data to make sure refactoring didn't break anything
assert.equal(getScores(input, scorePart2), 11657);
