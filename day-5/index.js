import assert from "node:assert/strict";
import { testInput, input } from "./input.js";

const movesRe = new RegExp("move (\\d+) from (\\d+) to (\\d+)");
const stacksRe = new RegExp("(\\[[A-Z]\\] ?|    ?)", "g");

/**
 * @param {string} moves
 * @returns {Array<{amount: number, from: number, to: number}>}
 */
function getMoves(moves) {
  return moves
    .trim()
    .split("\n")
    .map((line) => {
      const n = line.match(movesRe).slice(1, 4);
      return {
        amount: Number(n[0]),
        from: Number(n[1]),
        to: Number(n[2]),
      };
    });
}

/**
 * @param {string} stacks
 * @returns {string[][]} each array in the array represents a stack
 */
function makeStacks(stacks) {
  const lines = stacks
    .split("\n")
    .filter((e) => !!e)
    .slice(0, -1)
    .map((line) => line.match(stacksRe));

  // create array of arrays, where each array represents a stack
  // index 0 is the bottom of the stack
  const stacked = [];
  for (let i = 0; i < lines.length; i++) {
    const col = lines[i];
    for (let j = 0; j < col.length; j++) {
      if (!Array.isArray(stacked[j])) {
        stacked[j] = [];
      }
      const val = col[j].trim();
      if (val) {
        stacked[j].unshift(col[j].replace(/[\[\]]/g, "").trim());
      }
    }
  }
  return stacked;
}

/**
 * @param {string} crates
 * @returns {string}
 */
function crateMover9000(crates) {
  const [s, m] = crates.split(/\n\s*\n/);

  const stacks = makeStacks(s);
  const moves = getMoves(m);

  for (let m = 0; m < moves.length; m++) {
    const mv = moves[m];
    for (let i = 0; i < mv.amount; i++) {
      stacks[mv.to - 1].push(stacks[mv.from - 1].pop());
    }
  }
  return stacks.map((s) => s.pop()).join("");
}

// test
assert.equal(crateMover9000(testInput), "CMZ");

const resultPart1 = crateMover9000(input);
assert.equal(resultPart1, "QNNTGTPFN");
console.log("Result 1:", resultPart1);

/*********************************
 * Part 2
 */

/**
 * @param {string} crates
 * @returns {string}
 */
function crateMover9001(crates) {
  const [s, m] = crates.split(/\n\s*\n/);

  const stacks = makeStacks(s);
  const moves = getMoves(m);

  moves.forEach((mv) => {
    const len = stacks[mv.from - 1].length;
    const toMove = stacks[mv.from - 1].splice(len - mv.amount, len);
    stacks[mv.to - 1] = stacks[mv.to - 1].concat(toMove);
  });

  return stacks.map((s) => s.pop()).join("");
}

// test
assert.equal(crateMover9001(testInput), "MCD");

const resultPart2 = crateMover9001(input);
assert.equal(resultPart2, "GGNPJBTTR");
console.log("Result 2:", resultPart2);
