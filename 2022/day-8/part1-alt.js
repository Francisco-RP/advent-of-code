import assert from "node:assert/strict";
import fs from "node:fs";

/**
 * I wanted to see if I can solved it only using a flat grid array {number[]} instead of the
 * number[][] I had original tried before
 */

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
 *
 * @param {number} i index of current tree
 * @param {number} totalCols number of columns per row
 * @param {number[]} grid
 */
function checkIfVisible(i, totalCols, grid) {
  const col = i % totalCols;

  // first and last columns dont get checked
  if (col === 0 || col === totalCols - 1) return false;

  const tree = grid[i];

  // get the nearest row start
  const rowStart = i - col;
  const row = grid.slice(rowStart, rowStart + totalCols);

  // left
  if (row.slice(0, col).every((t) => t < tree)) {
    return true;
  }

  // right
  if (row.slice(col + 1).every((t) => t < tree)) {
    return true;
  }

  let isVisibleY = true;

  let prevRowStart = rowStart - totalCols;
  let prevRow = grid.slice(prevRowStart, prevRowStart + totalCols);
  while (prevRow.length) {
    if (prevRow[col] >= tree) {
      // not visible from the top
      isVisibleY = false;
      break;
    }
    // go up a row
    prevRowStart = prevRowStart - totalCols;
    prevRow = grid.slice(prevRowStart, prevRowStart + totalCols);
  }

  // if it hasn't changed to false, then it's visible
  if (isVisibleY) return true;

  // reset to true
  isVisibleY = true;

  let nextRowStart = rowStart + totalCols;
  let nextRow = grid.slice(nextRowStart, nextRowStart + totalCols);
  while (nextRow.length) {
    if (nextRow[col] >= tree) {
      // not visible from the top
      isVisibleY = false;
      break;
    }
    // go up a row
    nextRowStart = nextRowStart + totalCols;
    nextRow = grid.slice(nextRowStart, nextRowStart + totalCols);
  }
  if (isVisibleY) return true;

  return false;
}

function countEdgeTrees(rows, cols) {
  const topAndBottomRow = cols * 2;
  const leftRight = (rows - 2) * 2;
  return topAndBottomRow + leftRight;
}

/**
 * Find total number of visible trees in the grid
 * @param {string} str the input string
 * @returns {number}
 */
function part1(str) {
  str = str.trim();

  // this grid is flat
  // const grid = str.match(/\d/g).map(Number);
  const grid = str.replaceAll("\n", "").split("").map(Number);

  const lines = str.split("\n");
  const cols = lines[0].length;

  let count = countEdgeTrees(lines.length, cols);
  let i = cols;
  const len = grid.length - cols;

  for (; i < len; i++) {
    if (checkIfVisible(i, cols, grid)) {
      count += 1;
    }
  }

  return count;
}

try {
  // test
  assert.equal(part1(testInput), 21);
  console.log("test passed");

  console.time("Part 1");
  const result1 = part1(input);
  console.timeEnd("Part 1");

  assert.equal(result1, 1851);

  console.log("Result 1:", result1);
} catch (e) {
  console.error(e.message);
}
