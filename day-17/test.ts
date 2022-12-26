import { assertStrictEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { part1 } from "./index.ts";

const input = await Deno.readTextFile("./input.txt");
const testInput = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

Deno.test("part 1 example input small", () => {
  assertStrictEquals(part1(testInput, 2022), 3068);
});

Deno.test("Part 1 still produces the accepted answer", () => {
  assertStrictEquals(part1(input, 2022), 3069);
});

Deno.test("part 2 example input HUGE", () => {
  assertStrictEquals(part1(testInput, 1000000000000), 1514285714288);
});
