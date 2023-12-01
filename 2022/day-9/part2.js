import assert from "node:assert/strict";
import fs from "node:fs";
import { Visual } from "./visual.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;

const testInput2 = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`;

/***********************************************************************
 * Shared functions/classes
 */

class Segment {
  /**
   * @param {number} x starting x position
   * @param {number} y starting y position
   * @param {string} marker the marker to put on the grid
   * @param {Segment} follows segment that this segment should follow
   */
  constructor(x, y, marker, follows) {
    this.x = x;
    this.y = y;
    this.marker = marker;
    this.follows = follows;
  }

  /**
   * this move is just used for a Head segment
   * @param {"U"|"D"|"L"|"R"} dir
   */
  move(dir) {
    switch (dir) {
      case "U":
        this.y -= 1;
        break;
      case "D":
        this.y += 1;
        break;
      case "L":
        this.x -= 1;
        break;
      case "R":
        this.x += 1;
        break;
      default:
        throw new Error(`Invalid direction ${dir}`);
    }
  }

  toString() {
    return `${this.x},${this.y}`;
  }

  adjust() {
    const dX = Math.abs(this.x - this.follows.x);
    const dY = Math.abs(this.y - this.follows.y);

    if (dX <= 1 && dY <= 1) {
      // if only 1 away, no change. diagonal allowed but only for touching segments
      return;
    }

    if (this.follows.x !== this.x) {
      this.x += (this.follows.x - this.x) / dX;
    }
    if (this.follows.y !== this.y) {
      this.y += (this.follows.y - this.y) / dY;
    }
  }
}

class Rope {
  /**
   * @param {number} [totalKnots=1] how many tails to keep track of (default 1)
   */
  constructor(totalKnots = 1) {
    this.knotPositions = new Set();
    this.knotPositions.add("0,0");

    this.head = new Segment(0, 0, "H");

    this.totalKnots = totalKnots;

    /**
     * @type {Segment[]}
     */
    this.knots = [];

    // all segment start at 0,0
    for (let i = 0; i < totalKnots; i++) {
      const follows = i === 0 ? this.head : this.knots[i - 1];
      this.knots.push(new Segment(0, 0, i + 1, follows));
    }

    this.animation = new Visual();
  }

  track() {
    // track visits of only the last tail
    this.knotPositions.add(this.knots[this.totalKnots - 1].toString());
  }

  createFrame() {
    this.animation.addPlot([this.head.x, this.head.y], this.head.marker);
    this.knots.forEach((t) => this.animation.addPlot([t.x, t.y], t.marker));
    this.animation.addFrame();
  }
}

/**
 * @param {string} move
 * @param {Rope} rope instance of Rope
 */
function handleMove(move, rope) {
  const [dir, n] = move.split(" ");
  let count = +n;
  // console.log(move);

  while (count > 0) {
    rope.head.move(dir);

    rope.knots.forEach((tail) => {
      tail.adjust();
    });

    rope.track();

    count -= 1;

    // this is for the visualization
    // rope.createFrame();
  }

  console.log("");
}

/**
 * @param {string} str the input string
 * @returns {number}
 */
function getLastKnotVisits(str) {
  const rope = new Rope(9);

  str
    .trim()
    .split("\n")
    .map((line) => {
      handleMove(line, rope);
    });

  // this animates it in the console
  // rope.animation.draw(100);

  // this prints each animation frame
  // rope.animation.showFrames();

  return rope.knotPositions.size;
}

try {
  assert.equal(getLastKnotVisits(testInput), 1);
  assert.equal(getLastKnotVisits(testInput2), 36);
  console.log("example tests passed");

  console.time("Part 2");
  const result = getLastKnotVisits(input);
  console.timeEnd("Part 2");

  assert.equal(result, 2445);

  console.log("Result 2:", result);
} catch (e) {
  console.log("tests failed");
  console.error(e);
}
