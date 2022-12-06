import assert from "node:assert/strict";
import fs from "node:fs";
const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });

/**
 * identify the first position where the four most recently received characters were all different.
 * Specifically, it needs to report the number of characters from the beginning of the buffer to the
 * end of the first such four-character marker.
 *
 * @param {string} str the input string
 * @param {number} length total length of unique characters
 * @returns {string|number}
 */
function unique(str, length = 4) {
  str = str.trim();

  let cache = "";
  let len = str.length;

  for (let i = 0; i < len; i++) {
    for (let n = i; n < i + length; n++) {
      const char = str.charAt(n);

      if (cache.includes(char)) {
        cache = "";
        break; // break from this inner loop, back to outer
      }

      cache += char;

      if (cache.length === length) {
        // no repeats found, return index
        return n + 1;
      }
    }
  }
}

// test
assert.equal(unique("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 7);
assert.equal(unique("bvwbjplbgvbhsrlpgdmjqwftvncz"), 5);
assert.equal(unique("nppdvjthqldpwncqszvftbrmjlhg"), 6);
assert.equal(unique("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 10);
assert.equal(unique("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 11);

console.time("Part 1");
const result1 = unique(input);
console.timeEnd("Part 1");

// when I correctly solve the problem, I like to add this assertion so that if I refactor I know if I've broken anything
assert.equal(result1, 1816);

console.log("Result", "Part 1:", result1);

/*********************************
 * Part 2
 */

// test
assert.equal(unique("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14), 19);
assert.equal(unique("bvwbjplbgvbhsrlpgdmjqwftvncz", 14), 23);
assert.equal(unique("nppdvjthqldpwncqszvftbrmjlhg", 14), 23);
assert.equal(unique("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 14), 29);
assert.equal(unique("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 14), 26);

console.time("Part 2");
const result2 = unique(input, 14);
console.timeEnd("Part 2");

// when I correctly solve the problem, I like to add this assertion so that if I refactor I know if I've broken anything
assert.equal(result2, 2625);

console.log("Result", "Part 2:", result2);
