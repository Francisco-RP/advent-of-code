import { assertStrictEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { part1 } from ".";
// import { part2 } from ".";

const input = await Deno.readTextFile("./input.txt");

const testInput = ``;

Deno.test("part 1 example input", () => {
  assertStrictEquals(part1(testInput), 1111111111111);
});

// Deno.test("Part 1 still produces the accepted answer", () => {
//   assertStrictEquals(part1(input), 111111111111111);
// });

// Deno.test("part 2 example input", () => {
//   assertStrictEquals(part2(testInput), 1111111111111);
// });

// Deno.test("Part 2 still produces the accepted answer", () => {
//   assertStrictEquals(part2(input), 111111111111111);
// });
