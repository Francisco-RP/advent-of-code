import assert from "node:assert/strict";
import fs from "node:fs";
import { parser, compare } from "./shared.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

/***********************************************************************
 * Part 2
 */

function swap(arr, indexToMoveDown, indexToMoveUp) {
  const temp = arr[indexToMoveDown];
  arr[indexToMoveDown] = arr[indexToMoveUp];
  arr[indexToMoveUp] = temp;
}

/**
 * To find the decoder key for this distress signal, you need to determine the indices of the two
 * divider packets and multiply them together. (The first packet is at index 1, the second packet is
 * at index 2, and so on.) In this example, the divider packets are 10th and 14th, and so the
 * decoder key is 140.
 * @param {string} str the input string
 * @returns {number}
 */
function part2(str) {
  /**
   * @type {Array<number | number[]>}
   */
  const groups = parser(str).flat();
  const divider1 = [[2]];
  const divider2 = [[6]];
  groups.push(divider1, divider2);

  // bubble sort 🫧
  for (let i = 0; i < groups.length - 1; i++) {
    for (let j = 0; j < groups.length - i - 1; j++) {
      const left = groups[j];
      const right = groups[j + 1];

      if (!compare(left, right)) {
        swap(groups, j, j + 1);
      }
    }
  }

  return (groups.indexOf(divider1) + 1) * (groups.indexOf(divider2) + 1);
}

try {
  assert.equal(part2(testInput), 140);
  console.log("test passed");

  console.time("Part 2");
  const result2 = part2(input);
  console.timeEnd("Part 2");

  assert.equal(result2, 25935);

  console.log("Result 2:", result2);
} catch (e) {
  console.error(e.message);
}
