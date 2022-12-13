import assert from "node:assert/strict";
import fs from "node:fs";
import { grid2D } from "../lib.js";
import { draw, addToDrawStack, reset } from "./utils.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

/***********************************************************************
 * Part 1
 */

/**
 * elevations:  a (lowest) - z (highest), step 1
 * @type {string[]} the alphabet, generated programmatically as an array, because why not
 */
const elevations = Array(26)
  .fill(0)
  .map((_, i) => String.fromCharCode(i + 97));

// starting position: (S), starts at elevation (a)
// ending position: (E), elevation (z)

// During each step, you can move exactly one square up, down, left, or right.
// can only move 1 step highter

// the elevation of the destination square can be at most one higher than the elevation of your
// current square; that is, if your current elevation is m, you could step to elevation n, but not
// to elevation o. (This also means that the elevation of the destination square can be much lower
// than the elevation of your current square.)

class Node {
  /**
   * @param {number} x
   * @param {number} y
   * @param {string} elevation current elevation string, a-z
   */
  constructor(x, y, elevation) {
    this.x = x;
    this.y = y;
    this.elevation = elevation;

    this.height = elevations.indexOf(elevation);
    if (elevation === "S") {
      this.height = elevations.indexOf("a");
    } else if (elevation === "E") {
      this.height = elevations.indexOf("z");
    }
    this.explored = false;
    this.parent = null;
  }

  canMove(next) {
    if (!next) return false;
    const diff = next.height - this.height;
    // at most you can go 1 higher, but you can go backwards all the way down to 0
    return diff <= 1;
  }

  successors(grid) {
    const neighbors = [];

    this.up = grid[this.y - 1]?.[this.x];
    if (this.canMove(this.up)) neighbors.push(this.up);

    this.down = grid[this.y + 1]?.[this.x];
    if (this.canMove(this.down)) neighbors.push(this.down);

    this.left = grid[this.y]?.[this.x - 1];
    if (this.canMove(this.left)) neighbors.push(this.left);

    this.right = grid[this.y]?.[this.x + 1];
    if (this.canMove(this.right)) neighbors.push(this.right);

    return neighbors;
  }
}

/**
 *
 * @param {string[]} grid 2D as one flat array
 * @param {number} cols number of columns per row in the grid
 * @param {string} start
 * @param {string} end
 */
function findPath(grid, start, end) {
  let startNode;
  let endNode;
  // reset();

  const gridNodes = grid.map((row, y) => {
    return row.map((val, x) => {
      const n = new Node(x, y, val);
      if (val === start) {
        n.explored = true;
        startNode = n;
      }
      if (val === end) {
        endNode = n;
      }
      return n;
    });
  });

  const queue = [startNode];

  let next;
  while (queue.length) {
    next = queue.shift();

    // addToDrawStack(grid, next.x, next.y, "*");

    if (next === endNode) {
      break;
    }

    next.successors(gridNodes).forEach((n) => {
      if (!n.explored) {
        n.explored = true;
        n.parent = next;
        queue.push(n);
      }
    });
  }

  let count = 0;
  let back = next;
  while (back.parent) {
    count++;
    back = back.parent;
  }

  // draw(10);

  return count;
}

/**
 * @param {string} str the input string
 * @returns {string|number}
 */
function part1(str) {
  const grid = grid2D(str);
  const leastSteps = findPath(grid, "S", "E");
  return leastSteps;
}

try {
  assert.equal(part1(testInput), 31);
  console.log("test passed");

  console.time("Part 1");
  const result1 = part1(input);
  console.timeEnd("Part 1");

  assert.equal(result1, 350);

  console.log("Result 1:", result1);
} catch (e) {
  console.error(e.message);
}
