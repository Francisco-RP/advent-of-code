import assert from "node:assert/strict";
import fs from "node:fs";
import "../lib.js";
import { testInput } from "./testInput.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });

/***********************************************************************
 * Part 1
 */

class CPU {
  constructor() {
    this.register = 1;
    this.cycle = 1;

    this.checkAt = 20;
    this.strengths = [];
  }

  /**
   * @param {number} v
   */
  addx(v) {
    // takes 2 cycles to complete
    this.cycle += 1;
    this.checkSignalStength();
    this.register += v;
    this.cycle += 1;
    this.checkSignalStength();
  }

  noop() {
    // noop takes one cycle to complete. It has no other effect.
    this.cycle += 1;
    this.checkSignalStength();
  }

  checkSignalStength() {
    // the signal strength (the cycle number multiplied by the value of the X register) during the
    // 20th cycle and every 40 cycles after that (that is, during the 20th, 60th, 100th, 140th,
    // 180th, and 220th cycles).
    if (this.cycle === this.checkAt) {
      this.strengths.push(this.cycle * this.register);
      this.checkAt += 40;
    }
  }
}

/**
 * Find the signal strength during the 20th, 60th, 100th, 140th, 180th, and 220th cycles. What is
 * the sum of these six signal strengths?
 * @param {string} str the input string
 * @returns {number}
 */
function sumOfSignalStrength(str) {
  const system = new CPU();
  str
    .trim()
    .split("\n")
    .forEach((line) => {
      const [instr, arg] = line.split(" ");
      system[instr](+arg);
    });
  return system.strengths.sum();
}

try {
  // test
  assert.equal(sumOfSignalStrength(testInput), 13140);

  console.time("Part 1");
  const result1 = sumOfSignalStrength(input);
  console.timeEnd("Part 1");

  assert.equal(result1, 14860);

  console.log("Result 1:", result1);
} catch (e) {
  console.error(e.message);
}
