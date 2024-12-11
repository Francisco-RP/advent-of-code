import { assertStrictEquals } from "jsr:@std/assert";
import { solve } from "./solution.ts";

Deno.test("part 1 example - blink 6", () => {
  const testInput = `
125 17
`.trim();
  assertStrictEquals(solve(testInput, 6), 22);
});

Deno.test("part 1 example - blink 25", () => {
  const testInput = `
125 17
`.trim();
  assertStrictEquals(solve(testInput, 25), 55312);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(solve(input, 25), 194557);
});

Deno.test("Part 2", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(solve(input, 75), 231532558973909);
});
