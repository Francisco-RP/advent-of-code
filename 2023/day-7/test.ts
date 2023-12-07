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

Deno.test("part 2 custom 1", () => {
  const testInput = `
5T83K 352
JJ99J 360
8894T 242
Q49QQ 232
Q9QQQ 891
6262A 585
K2K2K 947
`.trim();
  assertStrictEquals(
    part2(testInput),
    (1 * 352) + (2 * 242) + (3 * 585) + (4 * 232) + (5 * 947) + (6 * 891) +
      (7 * 360),
  );
});

Deno.test("part 2 custom 2", () => {
  const testInput = `
AJAJA 10
QJJQQ 20
23222 30
J1234 5
JJJJJ 20
`.trim();
  assertStrictEquals(
    part2(testInput),
    (5 * 10) + (4 * 20) + (3 * 20) + (2 * 30) + 5,
  );
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 248750248);
});
