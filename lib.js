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
 */
export function getResult(fun, input, label) {
  console.time(label);
  const result = fun(input);
  console.timeEnd(label);
  console.log("Result", label, result);
}

/**
 *
 * @param {string} str
 * @param {boolean} [toNumber=false]
 * @returns {string[][]}
 */
export function grid2D(str, toNumber = false) {
  if (toNumber) {
    return str
      .trim()
      .split("\n")
      .map((line) => line.trim().split("").map(Number));
  }
  return str
    .trim()
    .split("\n")
    .map((line) => line.trim().split(""));
}

/**
 *
 * @param {string} str
 * @param {boolean} [toNumber=false]
 * @returns {{grid: string[], rows: number, cols: number}}
 */
export function flatGrid2D(str, toNumber = false) {
  const lines = str.trim().split("\n");
  const rows = lines.length;
  const cols = lines[0].trim().length;
  // one big flat array
  let grid = lines.join("").split("");
  if (toNumber) {
    grid = grid.map(Number);
  }
  return {
    grid,
    rows,
    cols,
  };
}

/**
 * Calculate the distance between 2 points on a 2D graph
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export const wait = (n) => new Promise((res) => setTimeout(res, n));
