import assert from "node:assert/strict";
import fs from "node:fs";
import "../lib.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });

export const testInput = `
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
assert.equal(mostCalories(testInput), 24000);
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
assert.equal(top3(testInput), 45000);
console.log("passed");

// answer
console.log("part 2:", top3(input));
