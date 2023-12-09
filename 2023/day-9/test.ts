import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", () => {
  const testInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim();
  assertStrictEquals(part1(testInput), 114);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 1980437560);
});

Deno.test("part 2 example input", () => {
  const testInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim();
  assertStrictEquals(part2(testInput), 2);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 977);
});
