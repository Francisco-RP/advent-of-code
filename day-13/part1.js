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
 * Part 1
 */

/**
 * What are the indices of the pairs that are already in the right order? (The first pair has index
 * 1, the second pair has index 2, and so on.) In the above example, the pairs in the right order
 * are 1, 2, 4, and 6; the sum of these indices is 13.
 * @param {string} str the input string
 * @returns {number}
 */
function part1(str) {
  const groups = parser(str);
  let correct = 0;
  groups.forEach((g, i) => {
    const [left, right] = g;
    if (compare(left, right)) {
      correct += i + 1;
    }
  });
  return correct;
}

try {
  assert.equal(part1(testInput), 13);
  console.log("test passed");

  console.time("Part 1");
  const result1 = part1(input);
  console.timeEnd("Part 1");

  assert.equal(result1, 5717);

  console.log("Result 1:", result1);
} catch (e) {
  console.error(e.message);
}
