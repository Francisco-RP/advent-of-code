import { assertStrictEquals } from "std/assert/mod.ts";
// import { part1 } from "./part1.ts";
// import { part2 } from "./part2.ts";
import { getLoops, getVisited, makeGrid, part1 } from "./both.ts";

Deno.test("example input both parts", async () => {
  const testInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim();

  const [grid, start] = makeGrid(testInput);

  // Part 1: get total unique visited positions in the grid
  const visited = getVisited(grid, start);
  assertStrictEquals(part1(visited), 41, "part 1");

  // Part 2: how many loops can we create
  const loops = await getLoops(grid, visited);
  assertStrictEquals(loops, 6, "part 2");
});

Deno.test("Main input both parts", async () => {
  const input = await Deno.readTextFile("./input.txt");

  const [grid, start] = makeGrid(input);
  const visited = getVisited(grid, start);
  assertStrictEquals(part1(visited), 4580, "part 1");

  const loops = await getLoops(grid, visited);
  assertStrictEquals(loops, 11111111111, "part 2");
});
