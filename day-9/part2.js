import assert from "node:assert/strict";
import fs from "node:fs";
import { Visual } from "./visual.js";

const { abs } = Math;

// const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
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
let tails = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

const viz = new Visual();

/**
 * @param {[number,number]} tail current tail position
 * @param {[number,number]} head current head position to follow
 * @returns {[number,number]} new position of the tail
 */
function calcTail(tail, head) {
  const [tx, ty] = tail;
  const [hx, hy] = head;

  const distanceX = abs(hx - tx);
  const distanceY = abs(hy - ty);

  /*
   if head is in any of the surrounding area, tail does not move
   HHH
   HTH
   HHH
  */
  if (distanceX <= 1 && distanceY <= 1) {
    return tail;
  }

  /*
    if head moves away, T moves up 1 and over 1
    h = previous position of H
    
    ..H.   ..H.
    ..h.   ..T.
    .T..   ....

    .T..   ....
    ..h.   ..T.
    ..H.   ..H.

    ..T.   ....
    .h..   .T..
    .H..   .H..
  */

  let newX = tail[0];
  let newY = tail[1];

  if (hx > 0 && hx > tx) {
    newX = hx - 1;
  } else if (hx < 0 && hx < tx) {
    newX = hx + 1;
  } else if (hx > 0 && hx < tx) {
    newX = hx + 1;
  } else if (hx < 0 && hx > tx) {
    newX = hx - 1;
  }

  if (hy > 0 && hy > ty) {
    newY = hy - 1;
  } else if (hy < 0 && hy < ty) {
    newY = hy + 1;
  } else if (hy > 0 && hy < ty) {
    newY = hy + 1;
  } else if (hy < 0 && hy > ty) {
    newY = hy - 1;
  }

  if (distanceY === 2) {
    // align the X position
    newX = hx;
  }

  if (distanceX === 2) {
    // align the Y position
    newY = hy;
  }

  return [newX, newY];
}

function allTails(h) {
  for (let i = 0; i < 9; i++) {
    if (i === 0) {
      // first tail follows the head
      tails[i] = calcTail(tails[i], h);
    } else {
      // other tails follow the one in front
      tails[i] = calcTail(tails[i], tails[i - 1]);
    }
    viz.addPlot(tails[i], i + 1);
  }
}

/**
 *
 * @param {[number,number]} curr current position of the head
 * @param {number} mvX next position
 * @param {number} mvY next position
 * @returns {[number,number]} new position of the head
 */
function moveHead([x, y], mvX, mvY) {
  const next = [x + mvX, y + mvY];
  return next;
}

/**
 * @param {string} move
 */
function handleMove(move) {
  const [dir, n] = move.split(" ");
  let count = +n;
  console.log(move);

  while (count > 0) {
    switch (dir) {
      case "U":
        head = moveHead(head, 0, -1);
        allTails(head);
        break;
      case "D":
        head = moveHead(head, 0, 1);
        allTails(head);
        break;
      case "L":
        head = moveHead(head, -1, 0);
        allTails(head);
        break;
      case "R":
        head = moveHead(head, 1, 0);
        allTails(head);
        break;
      default:
      // should never reach here
    }

    tailPositions.add(tails[8].join(","));
    count -= 1;
    // console.log(tails.join("  "));
    viz.addPlot(head, "H");
    tails.forEach((t, i) => viz.addPlot(t, i + 1));
    viz.draw();
  }
  console.log("");
}

/**
 * @param {string} str the input string
 * @returns {number}
 */
function getLastKnotVisits(str) {
  tailPositions = new Set();
  tailPositions.add("0,0");
  head = [0, 0];
  tails = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];
  str.trim().split("\n").map(handleMove);
  return tailPositions.size;
}

try {
  assert.equal(getLastKnotVisits(testInput), 1);
  // assert.equal(getLastKnotVisits(testInput2), 36);
  console.log("example tests passed");

  console.time("Part 2");
  // const result = getLastKnotVisits(input);
  console.timeEnd("Part 2");

  // assert.equal(result, 5902);

  console.log("Result 2:", result);
} catch (e) {
  console.log("tests failed");
  console.error(e.message);
}
