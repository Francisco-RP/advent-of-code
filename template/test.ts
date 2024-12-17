import { assertStrictEquals } from "jsr:@std/assert";
import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

Deno.test("part 1 example input", async () => {
  const testInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`.trim();
  assertStrictEquals(await part1(testInput), 1111111111);
});

// Deno.test("Part 1 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(await part1(input), 111111111111111);
// });

// Deno.test("part 2 example input", async () => {
//   const testInput = `
// 1abc2
// pqr3stu8vwx
// a1b2c3d4e5f
// treb7uchet
// `.trim();
//   assertStrictEquals(await part2(testInput), 1111111111111);
// });

// Deno.test("Part 2 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(await part2(input), 111111111111111);
// });
