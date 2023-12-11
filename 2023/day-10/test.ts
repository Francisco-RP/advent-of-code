import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", async () => {
  const testInput = `
.....
.S-7.
.|.|.
.L-J.
.....
`.trim();
  assertStrictEquals(await part1(testInput), 4);
});

Deno.test("part 1 example input 2", async () => {
  const testInput = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trim();
  assertStrictEquals(await part1(testInput), 8);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(await part1(input), 6947);
});

Deno.test("part 2 example input", () => {
  const testInput = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`.trim();
  assertStrictEquals(part2(testInput), 4);
});

Deno.test("part 2 example input 2", () => {
  const testInput = `
..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........
`.trim();
  assertStrictEquals(part2(testInput), 4);
});

Deno.test("part 2 example input 3", () => {
  const testInput = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`.trim();
  assertStrictEquals(part2(testInput), 8);
});

Deno.test("part 2 example input 4", () => {
  const testInput = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`.trim();
  assertStrictEquals(part2(testInput), 10);
});

// Deno.test("Part 2 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(part2(input), 111111111111111);
// });
