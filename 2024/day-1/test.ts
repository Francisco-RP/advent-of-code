import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", () => {
  const testInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`.trim();
  assertStrictEquals(part1(testInput), 11);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 3569916);
});

Deno.test("part 2 example input", () => {
  const testInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`.trim();
  assertStrictEquals(part2(testInput), 31);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 26407426);
});
