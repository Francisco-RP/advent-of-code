import "../lib.js";
import { input } from "./input.js";

const testInput = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`;

/**
 * transform data from input into an array of the summed values per reindeer and sorted in descending order
 * @param {string} data
 * @returns {number[]}
 */
function getTotals(data) {
  return data
    .trim()
    .split(/\n\s*\n/)
    .map((r) => r.trim().split("\n").map(Number).sum())
    .sort((a, b) => b - a);
}

/***********************************
 * Part 1
 */

/**
 * @param {string} data
 * @returns {number}
 */
function mostCalories(data) {
  return getTotals(data).shift();
}

// test first
console.assert(mostCalories(testInput) === 24000);
console.log("passed");

// get answer for part 1
console.log("part 1:", mostCalories(input));

/***********************************
 * Part 2
 */

/**
 * @param {string} data
 * @returns {number}
 */
function top3(data) {
  return getTotals(data).slice(0, 3).sum();
}

// test
console.assert(top3(testInput) === 45000);
console.log("passed");

// answer
console.log("part 2:", top3(input));
