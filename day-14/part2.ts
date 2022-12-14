import { assertStrictEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { parser, coords } from "./shared.ts";

const input = await Deno.readTextFile("./input.txt");

const testInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

/***********************************************************************
 * Part 2
 */

class Sand {
  coords: Set<string>;
  settled: Set<string>;
  minX: number;
  maxX: number;
  dropX: number;
  dropY: number;
  bottom: number;

  constructor(
    coords: Set<string>,
    minX: number,
    maxX: number,
    maxHeight: number,
    x: number,
    y: number
  ) {
    this.coords = coords;
    this.minX = minX;
    this.maxX = maxX;

    this.dropX = x;
    this.dropY = y;

    this.settled = new Set();
    this.bottom = maxHeight + 2;
  }

  isNotBlocked(x: number, y: number) {
    const str = `${x},${y}`;
    // check if hit a rock or settled sand
    return !this.coords.has(str) && !this.settled.has(str) && !this.atBottom(y);
  }

  atBottom(y: number) {
    return y === this.bottom;
  }

  addSettled(x: number, y: number) {
    this.settled.add(`${x},${y}`);
  }

  /**
   * check if the sand can move down, or down-left, or down-right <-- checking is done in that order
   */
  dropSand(x: number, y: number) {
    // check down
    let nextX = x;
    const nextY = y + 1;
    if (this.isNotBlocked(nextX, nextY)) {
      this.dropSand(nextX, nextY);
      return;
    }

    // check down-left
    nextX = x - 1;
    if (this.isNotBlocked(nextX, nextY)) {
      this.dropSand(nextX, nextY);
      return;
    }

    // check down-right
    nextX = x + 1;
    if (this.isNotBlocked(nextX, nextY)) {
      this.dropSand(nextX, nextY);
      return;
    }

    if (y === this.dropY) {
      this.addSettled(x, y);
      throw new Error("Sand flow has been blocked");
    }

    // if we are here, the sand has settled
    this.addSettled(x, y);
    return true; // sand has settled
  }

  begin() {
    try {
      while (true) {
        this.dropSand(this.dropX, this.dropY);
      }
    } catch (error) {
      console.log(error.message);
      return this.settled.size;
    }
  }
}

function part2(str: string) {
  const { lines, minX, maxX, height } = parser(str);
  const allCoords = coords(lines);

  const drip = new Sand(allCoords, minX, maxX, height, 500, 0);
  return drip.begin();
}

/*********************************************************** */

Deno.test("example input", () => {
  assertStrictEquals(part2(testInput), 93);
});

console.time("Part 2");
const result2 = part2(input);
console.timeEnd("Part 2");

Deno.test("still produces the accepted answer", () => {
  assertStrictEquals(result2, 26170);
});

console.log("Result 2:", result2);
