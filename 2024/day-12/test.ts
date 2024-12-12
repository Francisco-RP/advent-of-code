import { assertStrictEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

// Deno.test("part 1 example 1", () => {
//   const testInput = `
// AAAA
// BBCD
// BBCC
// EEEC
// `.trim();
//   assertStrictEquals(part1(testInput), 140);
// });

// Deno.test("part 1 example 2", () => {
//   const testInput = `
// OOOOO
// OXOXO
// OOOOO
// OXOXO
// OOOOO
// `.trim();
//   assertStrictEquals(part1(testInput), 772);
// });

// Deno.test("part 1 example 3", () => {
//   const testInput = `
// RRRRIICCFF
// RRRRIICCCF
// VVRRRCCFFF
// VVRCCCJFFF
// VVVVCJJCFE
// VVIVCCJJEE
// VVIIICJJEE
// MIIIIIJJEE
// MIIISIJEEE
// MMMISSJEEE
// `.trim();
//   assertStrictEquals(part1(testInput), 1930);
// });

// Deno.test("Part 1 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(part1(input), 1344578);
// });

/****************************************
 * Part 2 tests
 */

Deno.test("part 2 example 1", () => {
  const testInput = `
AAAA
BBCD
BBCC
EEEC
`.trim();
  assertStrictEquals(part2(testInput), 80);
});

Deno.test("part 2 example 2", () => {
  const testInput = `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`.trim();
  assertStrictEquals(part2(testInput), 436);
});

Deno.test("part 2 example 3", () => {
  const testInput = `
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE
`.trim();
  assertStrictEquals(part2(testInput), 236);
});

Deno.test("part 2 example 4", () => {
  const testInput = `
AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA
`.trim();
  assertStrictEquals(part2(testInput), 368);
});

// Deno.test("Part 2 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(part2(input), 1344578);
// });
