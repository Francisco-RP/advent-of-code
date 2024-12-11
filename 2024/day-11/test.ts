import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./solution.ts";

Deno.test("part 1 example - blink 6", () => {
  const testInput = `
125 17
`.trim();
  assertStrictEquals(part1(testInput, 6), 22);
});

Deno.test("part 1 example - blink 25", () => {
  const testInput = `
125 17
`.trim();
  assertStrictEquals(part1(testInput, 25), 55312);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input, 25), 194557);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input, 75), 111111111111111);
});
