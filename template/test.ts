import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./index.ts";
import { part2 } from "./index.ts";

Deno.env.set("TESTING", "true");

Deno.test("part 1 example input", () => {
  const testInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`.trim();
  assertStrictEquals(part1(testInput), 1111111111);
});

// Deno.test("Part 1 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(part1(input), 111111111111111);
// });

// Deno.test("part 2 example input", () => {
//   assertStrictEquals(part2(testInput), 1111111111111);
// });

// Deno.test("Part 2 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(part2(input), 111111111111111);
// });
