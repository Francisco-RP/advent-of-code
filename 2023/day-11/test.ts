import { assertStrictEquals } from "std/assert/mod.ts";
import { getPairDistance, part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", () => {
  const testInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim();
  assertStrictEquals(part1(testInput), 374);
});

Deno.test("getPairDistance", () => {
  let a = { x: 1, y: 6 };
  let b = { x: 5, y: 11 };
  assertStrictEquals(getPairDistance(a, b), 9);

  // Between galaxy 1 and galaxy 7: 15
  a = { x: 4, y: 0 };
  b = { x: 9, y: 10 };
  assertStrictEquals(getPairDistance(a, b), 15);

  // Between galaxy 3 and galaxy 6: 17
  a = { x: 0, y: 2 };
  b = { x: 12, y: 7 };
  assertStrictEquals(getPairDistance(a, b), 17);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 9918828);
});

Deno.test("part 2 example input", () => {
  const testInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim();
  assertStrictEquals(part2(testInput, 10), 1030);
});

Deno.test("part 2 example 2", () => {
  const testInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim();
  assertStrictEquals(part2(testInput, 100), 8410);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input, 1000000), 692506533832);
});
