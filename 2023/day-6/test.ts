import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./index.ts";
import { part2 } from "./index.ts";

Deno.env.set("TESTING", "true");

Deno.test("part 1 example input", () => {
  const testInput = `
Time:      7  15   30
Distance:  9  40  200
`.trim();
  assertStrictEquals(part1(testInput), 288);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 252000);
});

Deno.test("part 2 example input", () => {
  const testInput = `
Time:      7  15   30
Distance:  9  40  200
`.trim();
  assertStrictEquals(part2(testInput), 71503);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 36992486);
});
