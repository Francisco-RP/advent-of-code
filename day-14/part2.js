import assert from "node:assert/strict";
import fs from "node:fs";
import { parser, coords } from "./shared.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

/***********************************************************************
 * Part 2
 */

class Sand {
  /**
   *
   * @param {Set} coords set containing all non-passable areas
   * @param {number} minX lowest X coordinate of the grid
   * @param {number} maxX highest X coordinate of the grid
   * @param {number} maxHeight height of the graph
   * @param {number} x x coordinate where sand drops from
   * @param {number} y y coordinate where sand drops from
   */
  constructor(coords, minX, maxX, maxHeight, x, y) {
    this.coords = coords;
    this.minX = minX;
    this.maxX = maxX;

    this.dropX = x;
    this.dropY = y;

    this.settled = new Set();
    this.bottom = maxHeight + 2;
  }

  isNotBlocked(x, y) {
    const str = `${x},${y}`;
    // check if hit a rock or settled sand
    return !this.coords.has(str) && !this.settled.has(str) && !this.atBottom(y);
  }

  atBottom(y) {
    return y === this.bottom;
  }

  addSettled(x, y) {
    this.settled.add(`${x},${y}`);
  }

  /**
   * check if the sand can move down, or down-left, or down-right <-- checking is done in that order
   * @param {number} x current x of sand
   * @param {number} y current y of sand
   */
  dropSand(x, y) {
    // check down
    let nextX = x;
    const nextY = y + 1;
    if (this.isNotBlocked(nextX, nextY)) {
      this.dropSand(nextX, nextY);
      return;
    }

    // check down-left
    nextX = x - 1;
    if (this.isNotBlocked(nextX, nextY)) {
      this.dropSand(nextX, nextY);
      return;
    }

    // check down-right
    nextX = x + 1;
    if (this.isNotBlocked(nextX, nextY)) {
      this.dropSand(nextX, nextY);
      return;
    }

    if (y === this.dropY) {
      this.addSettled(x, y);
      throw new Error("Sand flow has been blocked");
    }

    // if we are here, the sand has settled
    this.addSettled(x, y);
    return true; // sand has settled
  }

  begin() {
    try {
      while (true) {
        this.dropSand(this.dropX, this.dropY);
      }
    } catch (error) {
      console.log(error.message);
      return this.settled.size;
    }
  }
}

/**
 * @param {string} str the input string
 * @returns {number}
 */
function part2(str) {
  const { lines, minX, maxX, height } = parser(str);
  const allCoords = coords(lines);

  const drip = new Sand(allCoords, minX, maxX, height, 500, 0);
  return drip.begin();
}

try {
  assert.equal(part2(testInput), 93);
  console.log("test passed");

  console.time("Part 2");
  const result2 = part2(input);
  console.timeEnd("Part 2");

  assert.equal(result2, 26170);

  console.log("Result 2:", result2);
} catch (e) {
  console.error(e.message);
}
