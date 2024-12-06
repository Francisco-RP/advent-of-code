import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", async () => {
  const testInput = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`.trim();
  assertStrictEquals(await part1(testInput), 18);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 2532);
});

Deno.test("part 2 example input", () => {
  const testInput = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`.trim();
  assertStrictEquals(part2(testInput), 9);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 1941);
});
