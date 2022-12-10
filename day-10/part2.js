import fs from "node:fs";
import "../lib.js";
import { testInput } from "./testInput.js";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });

/***********************************************************************
 * Part 2
 */

class CPU {
  constructor() {
    this.register = 1;
    this.cycle = 1;

    // 40 wide and 6 high
    this.screen = [[]];
    this.line = 0;
    this.pos = 0;
    this.draw();
  }

  draw() {
    const sprite = [this.register - 1, this.register, this.register + 1];

    this.screen[this.line][this.pos] = ".";

    if (sprite.includes(this.pos)) {
      this.screen[this.line][this.pos] = "#";
    }

    this.pos += 1;
    if (this.pos > 39) {
      this.screen.push([]);
      this.line += 1;
      this.pos = 0;
    }
  }

  /**
   * @param {number} v
   */
  addx(v) {
    this.cycle += 1;
    this.draw();
    this.register += v;
    this.cycle += 1;
    this.draw();
  }

  noop() {
    this.cycle += 1;
    this.draw();
  }
}

/**
 * @param {string} str the input string
 */
function part2(str) {
  const system = new CPU();
  str
    .trim()
    .split("\n")
    .forEach((line) => {
      const [instr, arg] = line.split(" ");
      system[instr](+arg);
    });

  console.log(system.screen.map((line) => line.join("")).join("\n"));
}

part2(testInput);
console.time("Part 2");
part2(input);
console.timeEnd("Part 2");
