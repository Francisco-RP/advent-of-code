import assert from "node:assert/strict";
import "../lib.js";
import { testInput, input } from "./input.js";

// https://adventofcode.com/2022/day/3

function toInt(char) {
  if (/[a-z]/.test(char)) {
    return char.charCodeAt(0) - 96;
  }
  return char.charCodeAt(0) - 38;
}

/**
 * @param {string} input
 * @returns {number}
 */
function findItems(input) {
  return input
    .trim()
    .split("\n")
    .map((sack) => {
      const half = sack.length / 2;
      const left = sack.substring(0, half);
      const right = sack.substring(half);
      const sharedType = left
        .split("")
        .filter((char) => right.includes(char))
        .pop();
      return toInt(sharedType);
    })
    .sum();
}

// test
assert.equal(findItems(testInput), 157);

const resultPart1 = findItems(input);
assert.equal(resultPart1, 7716);
console.log("Result 1:", resultPart1);

/*********************************
 * Part 2
 */

/**
 * Search group of 3 rucksacks for same letter (badge)
 * @param {string[]} group
 * @returns {string}
 */
function searchGroup(group) {
  return group[0]
    .split("")
    .filter((char) => group[1].includes(char) && group[2].includes(char))
    .pop();
}

function findBadges(input) {
  return input
    .trim()
    .split("\n")
    .chunk(3) // <- new, in my lib.js
    .map(searchGroup)
    .map(toInt)
    .sum();
}

// test
assert.equal(findBadges(testInput), 70);

const resultPart2 = findBadges(input);
assert.equal(resultPart2, 2973);
console.log("Result 2:", resultPart2);
