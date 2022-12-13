/**
 * Since I'm using eval I need to sanitze the inputs
 */

// only allowed are: whitespace (including \n), numbers, commas, square brackets
const re = new RegExp("[^,0-9\\[\\]\\s]", "g");
function sanitize(str) {
  return str.replace(re, "");
}

export function parser(str) {
  const groups = sanitize(str.trim())
    .split("\n\n")
    .map((g) => g.trim().split("\n").map(eval));
  return groups;
}

/**
 *
 * @param {number[]|number} left
 * @param {number[]|number} right
 * @returns {boolean} if it is in the right order
 */
export function compare(left, right) {
  if (typeof left === "number") {
    left = [left];
  }
  if (typeof right === "number") {
    right = [right];
  }

  const longestLength = left.length > right.length ? left.length : right.length;

  for (let i = 0; i < longestLength; i++) {
    const leftSide = left[i];
    const rightSide = right[i];

    if (typeof leftSide === "undefined" && typeof rightSide !== "undefined") {
      // left side ran out of items first, is in the right order
      return true;
    }
    if (typeof leftSide !== "undefined" && typeof rightSide === "undefined") {
      // right side ran out first, not in the right order
      return false;
    }

    if (typeof leftSide === "number" && typeof rightSide === "number") {
      if (leftSide === rightSide) {
        continue;
      }
      return leftSide < rightSide;
    }

    if (Array.isArray(leftSide) || Array.isArray(rightSide)) {
      const next = compare(leftSide, rightSide);
      if (typeof next === "boolean") {
        return next;
      }
    }
  }
}
