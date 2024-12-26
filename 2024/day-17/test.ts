import { assertStrictEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", async () => {
  const testInput = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`.trim();
  assertStrictEquals(await part1(testInput), "4,6,3,5,6,3,5,2,1,0");
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(await part1(input), "2,7,4,7,2,1,7,5,1");
});

Deno.test("part 2 example input", async () => {
  const testInput = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`.trim();
  assertStrictEquals(await part2(testInput), 117440);
});

// Deno.test("Part 2 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(await part2(input), 111111111111111);
// });
