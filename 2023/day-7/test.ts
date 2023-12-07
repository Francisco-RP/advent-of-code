import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./index.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", () => {
  const testInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim();
  assertStrictEquals(part1(testInput), 6440);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 249390788);
});

Deno.test("part 2 example input", () => {
  const testInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim();
  assertStrictEquals(part2(testInput), 5905);
});

// Deno.test("Part 2 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(part2(input), 111111111111111);
// });
