import assert from "node:assert/strict";
import fs from "node:fs";
import { grid2D } from "../lib.js";
import { draw, addFrame, reset } from "./animation.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

/***********************************************************************
 * Part 2
 */

/**
 * elevations:  a (lowest) - z (highest), step 1
 * @type {string[]} the alphabet, generated programmatically as an array, because why not
 */
const elevations = Array(26)
  .fill(0)
  .map((_, i) => String.fromCharCode(i + 97));

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
    const diff = this.height - next.height;
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
  let endNodes = [];
  reset();

  const gridNodes = grid.map((row, y) => {
    return row.map((val, x) => {
      const n = new Node(x, y, val);
      if (val === start) {
        n.explored = true;
        startNode = n;
      }
      if (val === end) {
        endNodes.push(n);
      }
      return n;
    });
  });

  const queue = [startNode];

  let next;
  while (queue.length) {
    next = queue.shift();

    // addFrame(grid, next.x, next.y, "*");

    if (endNodes.includes(next)) {
      console.log("found the end");
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

  // draw(100);
  return count;
}

/***********************************************************************
 * Part 2
 */

/**
 * @param {string} str the input string
 * @returns {number}
 */
function part2(str) {
  const grid = grid2D(str);
  const leastSteps = findPath(grid, "E", "a");
  return leastSteps;
}

try {
  assert.equal(part2(testInput), 29);
  console.log("test passed");

  console.time("Part 2");
  const result2 = part2(input);
  console.timeEnd("Part 2");

  // assert.equal(result2, AAAAAA);

  console.log("Result 2:", result2);
} catch (e) {
  console.error(e.message);
}
