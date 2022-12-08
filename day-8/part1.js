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
 * A tree is visible if all of the other trees between it and an edge of the grid are shorter than
 * it. Only consider trees in the same row or column; that is, only look up, down, left, or right
 * from any given tree.
 * @param {number} row
 * @param {number} col
 * @param {number[][]} grid
 * @returns {boolean} true if visible
 */
function checkIfVisible(row, col, grid) {
  const tree = grid[row][col];

  let isVisibleY = true;

  let up = row - 1;
  while (up >= 0) {
    if (grid[up][col] >= tree) {
      // not visible from the top
      isVisibleY = false;
      break;
    }
    up -= 1;
  }
  if (isVisibleY) return true;

  isVisibleY = true;

  let down = row + 1;
  while (down < grid.length) {
    if (grid[down][col] >= tree) {
      // not visible from the bottom
      isVisibleY = false;
      break;
    }
    down += 1;
  }

  if (isVisibleY) return true;

  // left
  const toLeft = grid[row].slice(0, col);
  if (toLeft.every((n) => n < tree)) {
    // it is visible from the left
    return true;
  }

  // right
  const toRight = grid[row].slice(col + 1);
  if (toRight.every((n) => n < tree)) {
    // it is visible from the right
    return true;
  }

  return false;
}

/**
 *
 * @param {number[][]} grid
 * @return {number}
 */
function countEdgeTrees(grid) {
  const topAndBottomRow = grid[0].length * 2;
  const leftRight = (grid.length - 2) * 2;
  return topAndBottomRow + leftRight;
}

/**
 * Find total number of visible trees in the grid
 * @param {string} str the input string
 * @returns {number}
 */
function part1(str) {
  const grid = str
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number));

  let count = countEdgeTrees(grid);

  for (let i = 1; i < grid.length - 1; i++) {
    const row = grid[i];

    for (let n = 1; n < row.length - 1; n++) {
      const col = row[n];

      if (checkIfVisible(i, n, grid)) {
        count += 1;
      }
    }
  }
  return count;
}

// test
assert.equal(part1(testInput), 21);

console.time("Part 1");
const result1 = part1(input);
console.timeEnd("Part 1");

assert.equal(result1, 1851);

console.log("Result 1:", result1);
