import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", () => {
  const testInput = `
2333133121414131402
`.trim();
  assertStrictEquals(part1(testInput), 1928);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 6216544403458);
});

Deno.test("part 2 example simple", () => {
  const testInput = `
12345
`.trim();
  assertStrictEquals(part2(testInput), 132);
});

/*
35 46 31 46 62 60
0  1  2  3  4  5
000.....1111......222.3333......444444..555555
000.....1111555555222.3333......444444..
000.....1111555555222.3333444444........
0003333.1111555555222.....444444........
checkSum = 1325
*/
Deno.test("part 2 edge case", () => {
  const testInput = `
354631466260
`.trim();
  assertStrictEquals(part2(testInput), 1325);
});

Deno.test("part 2 example input", () => {
  const testInput = `
2333133121414131402
`.trim();
  assertStrictEquals(part2(testInput), 2858);
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 6237075041489);
});
