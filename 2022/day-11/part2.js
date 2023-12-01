import assert from "node:assert/strict";
import fs from "node:fs";

const input = fs.readFileSync("./input.txt", { encoding: "utf-8" });
const testInput = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

let superMod = 1;

class Monkey {
  constructor() {
    /**
     * @type {number[]}
     */
    this.items = [];
    this.divisibleBy = 0;
    this.pass = 0;
    this.inspections = 0;
  }

  setItems(arr) {
    this.items = arr;
  }

  /**
   * @param {number} fail
   */
  setTest(fail) {
    this.fail = fail;
    this.test = (n) => (n % this.divisibleBy === 0 ? this.pass : fail);
  }

  /**
   * @param {'+'|'*'} op
   * @param {number|'old'} val
   */
  setOp(op, val) {
    this.op = op;
    this.val = val;
    if (op === "*") {
      this.runOp = (n) => n * (val === "old" ? n : val);
    } else {
      this.runOp = (n) => n + (val === "old" ? n : val);
    }
  }

  receive(item) {
    this.items.push(item);
  }

  /**
   *
   * @returns {[number, number]} monkey to throw to, new worry level
   */
  inspectAndThrow() {
    const item = this.items.shift();
    if (item) {
      this.inspections += 1;
      let n = this.runOp(item);

      // reduce worry level
      n = n % superMod;

      const to = this.test(n);
      return [to, n];
    }
    return [];
  }
}

/**
 * @type {Monkey[]}
 */
let monkeys = [];

function round() {
  for (let i = 0; i < monkeys.length; i++) {
    const m = monkeys[i];
    while (m.items.length) {
      const [x, n] = m.inspectAndThrow();
      if (typeof x === "number") {
        monkeys[x].receive(n);
      }
    }
  }
}

/**
 * @param {string} line
 */
function parseLine(line) {
  line = line.trim();
  if (!line) return;

  if (line.startsWith("Monkey")) {
    monkeys.push(new Monkey());
    return;
  }

  // get last added monkey
  const m = monkeys[monkeys.length - 1];

  if (line.includes("Starting")) {
    m.setItems(line.match(/\d+/g).map(Number));
    return;
  }

  if (line.includes("Operation")) {
    const [, op, val] = line.match(/(\*|\+) (\d+|old)/);
    m.setOp(op, val === "old" ? val : +val);
    return;
  }

  if (line.includes("Test")) {
    m.divisibleBy = +line.match(/\d+/).shift();
    superMod *= m.divisibleBy;
    return;
  }
  if (line.includes("true")) {
    m.pass = +line.match(/\d+/).shift();
    return;
  }
  if (line.includes("false")) {
    m.setTest(+line.match(/\d+/).shift());
  }
}

function part2(str, rounds) {
  monkeys = [];
  superMod = 1;
  str.trim().split("\n").forEach(parseLine);
  for (let i = 0; i < rounds; i++) {
    round();
  }
  const sorted = monkeys.map((m) => m.inspections).sort((a, b) => a - b);
  return sorted.pop() * sorted.pop();
}

try {
  assert.equal(part2(testInput, 10000), 2713310158);

  console.time("Part 2");
  const result = part2(input, 10000);
  console.timeEnd("Part 2");

  assert.equal(result, 19457438264);

  console.log("Result 2:", result);
} catch (e) {
  console.error(e.message);
}
