import { assertStrictEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { findHeight } from "./index.ts";

const input = await Deno.readTextFile("./input.txt");
const testInput = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

Deno.test("part 1 example input small", () => {
  assertStrictEquals(findHeight(testInput, 2022), 3068);
});

Deno.test({
  name: "Part 1 still produces the accepted answer",
  fn() {
    assertStrictEquals(findHeight(input, 2022), 3069);
  },
});

Deno.test({
  name: "part 2 example input HUGE",
  fn() {
    assertStrictEquals(findHeight(testInput, 1000000000000), 1514285714288);
  },
});

// Deno.test("part 2 still produces the accepted answer", () => {
//   assertStrictEquals(part1(input, 1000000000000), 0);
// });
