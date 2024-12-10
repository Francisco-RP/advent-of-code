import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example simple", () => {
  const testInput = `
0123
1234
8765
9876
`.trim();
  assertStrictEquals(part1(testInput), 1);
});
Deno.test("part 1 example input", () => {
  const testInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.trim();
  assertStrictEquals(part1(testInput), 36);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 496);
});

Deno.test("part 2 example input", () => {
  const testInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.trim();
  assertStrictEquals(part2(testInput), 81);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 1120);
});
