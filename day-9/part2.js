import assert from "node:assert/strict";
import fs from "node:fs";

const { abs } = Math;

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
    // console.log("head", [hx, hy], "tail", newTailPos);
    tailPositions.add(newTailPos.join(","));
    count -= 1;
    // draw(head, tail);
  }
}

/**
 * @param {string} str the input string
 * @returns {number}
 */
function getLastKnotVisits(str) {
  tailPositions = new Set();
  tailPositions.add("0,0");
  head = [0, 0];
  tail = [0, 0];
  str.trim().split("\n").map(handleMove);
  return tailPositions.size;
}

try {
  assert.equal(getLastKnotVisits(testInput), 13);
  assert.equal(getLastKnotVisits(testInput2), 36);
  console.log("example test passed");

  console.time("Part 2");
  const result = getLastKnotVisits(input);
  console.timeEnd("Part 2");

  // assert.equal(result, 5902);

  console.log("Result 2:", result);
} catch (e) {
  console.log("tests failed");
  console.error(e.message);
}
