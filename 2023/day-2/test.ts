import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./index.ts";
import { part2 } from "./index.ts";

Deno.env.set("TESTING", "true");

Deno.test("part 1 example input", () => {
  const testInput = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`.trim();
  assertStrictEquals(part1(testInput), 8);
});

Deno.test("part 1 custom input", () => {
  const testInput = `
Game 13: 6 red, 7 blue, 7 green; 3 blue, 4 red, 13 green; 1 blue, 6 red, 11 green; 2 red, 1 blue, 14 green; 8 green, 5 blue, 2 red; 4 blue, 18 green, 4 red
Game 14: 16 red, 3 blue, 1 green; 7 green, 3 red; 16 red, 15 green, 3 blue; 3 blue, 13 red, 10 green
Game 15: 1 blue, 1 red; 3 blue, 2 green; 1 red; 2 red, 2 green, 3 blue; 3 blue, 1 red, 3 green
`.trim();
  assertStrictEquals(part1(testInput), 15);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 2563);
});

Deno.test("part 2 example input", () => {
  const testInput = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
  `.trim();
  assertStrictEquals(part2(testInput), 2286);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 70768);
});
