import assert from "node:assert/strict";
import "../lib.js";
import { testInput, input } from "./input.js";

/*******************************************
 * Shared
 */

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

/**
 * Convert the string input into an array of tuples and use the getScore function to get score of
 * each round, then retun it all summed up
 * @param {string} input
 * @param {(round: [string, string]) => number} getScore
 */
function parseInput(input, getScore) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.trim().split(" "))
    .map((pair) => getScore(pair))
    .sum();
}

/*******************************************
 * Part 1
 */

const win = {
  X: "C", // rock X beats scissors C
  Y: "A", // paper Y beats rock A
  Z: "B", // scissors Z beats paper B
};

const lose = {
  X: "B", // rock X loses to paper B
  Y: "C", // paper Y loses to scissors C
  Z: "A", // scissors Z loses to rock A
};

const draw = {
  X: "A", // rock X === rock A
  Y: "B", // paper Y === paper B
  Z: "C", // scissors Z === scissors C
};

/**
 * Score a single round by checking if your play (`you`) beats the opponent's move (`them`)
 * @param {[string, string]} round
 * @param {string} round[0] `them`, the opponent move
 * @param {string} round[1] `you`, your move
 * @returns {number}
 */
function scorePart1([them, you]) {
  if (win[you] === them) {
    return scores[you] + scores.won;
  }
  if (lose[you] === them) {
    return scores[you] + scores.lost;
  }
  // draw
  return scores[you] + scores.draw;
}

// test
assert.equal(parseInput(testInput, scorePart1), 15);

const resultPart1 = parseInput(input, scorePart1);

// test with final data to make sure refactoring didn't break anything
assert.equal(resultPart1, 10816);

console.log("Result 1:", resultPart1);

/*******************************************
 * Part 2
 */

// flip the key/values of the previous object because we need to know what you need to play
// against their move now
const win2 = flipKeys(win);
const lose2 = flipKeys(lose);
const draw2 = flipKeys(draw);

/**
 * @param {[string, string]} round
 * @param {string} round[0] `them`, the opponent move
 * @param {string} round[1] `you`, whether you are supposed to win/lose/draw
 * @returns {number}
 */
function scorePart2([them, you]) {
  if (you === "X") {
    // X means you need to lose,
    // them = A, to lose I play Z
    // them = B, to lose I play X
    // them = C, to lose I play Y
    const myPlay = lose2[them];
    return scores[myPlay] + scores.lost;
  }
  if (you === "Y") {
    // Y means you need to end the round in a draw
    // them = A, to draw I play X
    // them = B, to draw I play Y
    // them = C, to draw I play Z
    const myPlay = draw2[them];
    return scores[myPlay] + scores.draw;
  }

  // Z means you need to win.
  // them = A, to win I play Y
  // them = B, to win I play Z
  // them = C, to win I play X
  const myPlay = win2[them];
  return scores[myPlay] + scores.won;
}

// test
assert.equal(parseInput(testInput, scorePart2), 12);

const resultPart2 = parseInput(input, scorePart2);

// test with final data to make sure refactoring didn't break anything
assert.equal(resultPart2, 11657);

// show result
console.log("Result 2:", resultPart2);
