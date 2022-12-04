import assert from "node:assert/strict";
import "../lib.js";
import { testInput, input } from "./input.js";

// https://adventofcode.com/2022/day/4

/**
 *
 * @param {string} group
 * @returns {[number, number]}
 */
function parseRange(group) {
  return group.split("-").map(Number);
}

/**
 *
 * @param {[string,string]} param0
 * @returns {boolean}
 */
function pairsContained([group1, group2]) {
  const [r1min, r1max] = parseRange(group1);
  const [r2min, r2max] = parseRange(group2);

  // is range1 contained by range2
  if (r1min >= r2min && r1max <= r2max) {
    return true;
  }

  // is range2 contained by range1
  if (r2min >= r1min && r2max <= r1max) {
    return true;
  }

  return false;
}

/**
 * @param {string} input
 * @returns {number}
 */
function fullyContained(input) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(","))
    .filter(pairsContained).length;
}

// test
assert.equal(fullyContained(testInput), 2);

const resultPart1 = fullyContained(input);
assert.equal(resultPart1, 550);
console.log("Result 1:", resultPart1);

/*********************************
 * Part 2
 */

/**
 * @param {[string,string]} param0
 * @returns {boolean}
 */
function pairsOverlapped([group1, group2]) {
  const [r1min, r1max] = parseRange(group1);
  const [r2min, r2max] = parseRange(group2);

  const arr1 = Array(r1max - r1min + 1)
    .fill(0)
    .map((_, i) => i + r1min);
  const arr2 = Array(r2max - r2min + 1)
    .fill(0)
    .map((_, i) => i + r2min);

  return arr1.some((n) => arr2.includes(n));
}

/**
 * @param {string} input
 * @returns {number}
 */
function overlaps(input) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(","))
    .filter(pairsOverlapped).length;
}

// test
assert.equal(overlaps(testInput), 4);

const resultPart2 = overlaps(input);
assert.equal(resultPart2, 931);
console.log("Result 2:", resultPart2);
