import { assertStrictEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

const input = await Deno.readTextFile("./input.txt");

const testInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

Deno.test("Part 1 with example input", () => {
  assertStrictEquals(part1(testInput), 24);
});

Deno.test("Part 1 still produces the accepted answer", () => {
  assertStrictEquals(part1(input), 614);
});

Deno.test("Part 2 with example input", () => {
  assertStrictEquals(part2(testInput), 93);
});

Deno.test("Part 2 still produces the accepted answer", () => {
  assertStrictEquals(part2(input), 26170);
});
