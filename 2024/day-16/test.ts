import { assertStrictEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example 1", async () => {
  const testInput = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`.trim();
  assertStrictEquals(await part1(testInput), 7036);
});

Deno.test("part 1 example 2", async () => {
  const testInput = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`.trim();
  assertStrictEquals(await part1(testInput), 11048);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(await part1(input), 90440);
});

Deno.test.only("part 2 example 1", async () => {
  const testInput = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`.trim();
  assertStrictEquals(await part2(testInput), 45);
});

Deno.test("part 2 example 2", async () => {
  const testInput = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`.trim();
  assertStrictEquals(await part2(testInput), 64);
});

// Deno.test("Part 2 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(await part2(input), 111111111111111);
// });
