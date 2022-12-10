import assert from "node:assert/strict";
import fs from "node:fs";
const { abs } = Math;

/***********************************************************************
 * Part 1
 */

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

let tailPositions = new Set();
tailPositions.add("0,0");
let head = [0, 0];
let tail = [0, 0];

/**
 * @param {[number,number]} curr current tail position
 * @param {[number,number]} head current head position
 * @returns {[number,number]} new position of the tail
 */
function calcTail([tx, ty], [hx, hy]) {
  const newTailPos = [tx, ty];

  const distanceX = abs(hx - tx);
  const distanceY = abs(hy - ty);
  // if both x and y are only 1 step away, tail doesn't move
  if (distanceX <= 1 && distanceY <= 1) {
    // console.log("head", [hx, hy], "tail", newTailPos, "no move");
    return newTailPos;
  }

  // check X
  if (hx > tx) {
    newTailPos[0] = hx - 1;
  } else {
    newTailPos[0] = hx + 1;
  }

  // check Y
  if (hy > ty) {
    newTailPos[1] = hy - 1;
  } else {
    newTailPos[1] = hy + 1;
  }

  if (distanceY === 2) {
    // align the X position
    newTailPos[0] = hx;
  }

  if (distanceX === 2) {
    // align the Y position
    newTailPos[1] = hy;
  }

  return newTailPos;
}

/**
 *
 * @param {[number,number]} curr current position of the head
 * @param {number} mvX next position
 * @param {number} mvY next position
 * @returns {[number,number]} new position of the head
 */
function moveHead([x, y], mvX, mvY) {
  return [x + mvX, y + mvY];
}

/**
 * @param {string} move
 */
function handleMove(move) {
  const [dir, n] = move.split(" ");
  let count = +n;

  while (count > 0) {
    switch (dir) {
      case "U":
        head = moveHead(head, 0, -1);
        tail = calcTail(tail, head);
        break;
      case "D":
        head = moveHead(head, 0, 1);
        tail = calcTail(tail, head);
        break;
      case "L":
        head = moveHead(head, -1, 0);
        tail = calcTail(tail, head);
        break;
      case "R":
        head = moveHead(head, 1, 0);
        tail = calcTail(tail, head);
        break;
      default:
      // should never reach here
    }

    tailPositions.add(tail.join(","));

    count -= 1;
  }
}

/**
 * Assume the head and the tail both start at the same position, overlapping.
 * count up all of the positions the tail visited at least once
 * @param {string} str the input string
 * @returns {number}
 */
function getTailPositions(str) {
  tailPositions = new Set();
  tailPositions.add("0,0");
  head = [0, 0];
  tail = [0, 0];
  str.trim().split("\n").map(handleMove);
  return tailPositions.size;
}

try {
  assert.equal(getTailPositions(testInput), 13);
  console.log("example test passed");

  console.time("Part 1");
  const result1 = getTailPositions(input);
  console.timeEnd("Part 1");

  assert.equal(result1, 5902);

  console.log("Result 1:", result1);
} catch (e) {
  console.log("tests failed");
  console.error(e.message);
}
