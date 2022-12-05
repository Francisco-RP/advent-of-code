import assert from "node:assert/strict";
Array.prototype.sum = function () {
  return this.reduce((a, b) => a + b, 0);
};

/**
 * Take a flat array and split it into chunks of `size` length
 * @param {unknown[]} size size of each chunk
 * @returns {unknown[][]} an array of chunks (which are also arrays)
 */
Array.prototype.chunk = function (size) {
  let chunk = [];
  const chunks = [];
  this.forEach((item) => {
    if (chunk.length < size) {
      chunk.push(item);
    } else {
      chunks.push(chunk);
      chunk = [item];
    }
  });
  if (chunk.length) chunks.push(chunk);
  return chunks;
};

/**
 *
 * @param {(str: string) => string|number} fun
 * @param {string} input
 * @param {string} label
 * @param {string|number} expected
 */
export function getResult(fun, input, label, expected) {
  console.time(label);
  const result = fun(input);
  console.timeEnd(label);

  // when I correctly solve the problem, I like to add this assertion so that if I refactor I know
  // if I've broken anything
  if (expected) assert.equal(result, expected);

  console.log("Result", label, result);
}
