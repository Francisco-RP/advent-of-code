import assert from "node:assert/strict";
import fs from "node:fs";

/***********************************************************************
 * Input data
 */

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = `
30373
25512
65332
33549
35390`;

/**
 * A tree's scenic score is found by multiplying together its viewing distance in each of the four
 * directions.
 * @param {number} row
 * @param {number} col
 * @param {number[][]} grid
 * @returns {number} score
 */
function getScore(row, col, grid) {
  const tree = grid[row][col];

  let top = 1;
  let up = row - 1;
  while (up > 0) {
    if (grid[up][col] < tree) {
      top += 1;
    } else {
      break; // stop if we encounter a big tree
    }
    up -= 1;
  }

  let bottom = 1;
  let down = row + 1;
  while (down < grid.length - 1) {
    if (grid[down][col] < tree) {
      bottom += 1;
    } else {
      break; // stop if we encounter a big tree
    }
    down += 1;
  }

  let leftCount = 1;
  let left = col - 1;
  while (left > 0) {
    if (grid[row][left] < tree) {
      leftCount += 1;
    } else {
      break; // stop if we encounter a big tree
    }
    left -= 1;
  }

  let rightCount = 1;
  let right = col + 1;
  while (right < grid[row].length - 1) {
    if (grid[row][right] < tree) {
      rightCount += 1;
    } else {
      break; // stop if we encounter a big tree
    }
    right += 1;
  }

  return top * bottom * leftCount * rightCount;
}

// unit test get score
const testGrid = testInput
  .trim()
  .split("\n")
  .map((line) => line.split("").map(Number));
assert.equal(getScore(1, 2, testGrid), 4);
assert.equal(getScore(3, 2, testGrid), 8);

/**
 * @param {string} str the input string
 * @returns {number}
 */
function part2(str) {
  const grid = str
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number));

  let highestScore = 0;

  for (let i = 1; i < grid.length - 1; i++) {
    const row = grid[i];

    for (let n = 1; n < row.length - 1; n++) {
      const col = row[n];

      const score = getScore(i, n, grid);
      if (score > highestScore) {
        highestScore = score;
      }
    }
  }

  return highestScore;
}

// test
assert.equal(part2(testInput), 8);

console.time("Part 2");
const result2 = part2(input);
console.timeEnd("Part 2");

assert.equal(result2, 574080);

console.log("Result 2:", result2);
