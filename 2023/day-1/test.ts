import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./index.ts";
import { part2 } from "./index.ts";

Deno.env.set("TESTING", "true");

Deno.test("part 1 example input", () => {
  const testInput = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`.trim();
  assertStrictEquals(part1(testInput), 142);
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 56049);
});

Deno.test("part 2 example input", () => {
  const testInput = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
  `.trim();
  assertStrictEquals(part2(testInput), 281);
});

Deno.test("part 2 custom test 1", () => {
  const testInput = `
93two4foureight
8fqddclzvlx
tdpcspmg39ddqkdlpjxvkdtjpc21
fivessmncpxsd3eight
44hjrhqdqf19pxkb
bmcgjkkkhfive5twonekc
twomv4nine
16rrksxjzjlt5plmvjtvhkfnineeight
cmczrnjjsntptjffzrpqthreemjpfhsjbrmnlkzpvvvmj8
one81six
  `.trim();
  assertStrictEquals(
    part2(testInput),
    98 + 88 + 31 + 58 + 49 + 51 + 29 + 18 + 38 + 16,
  );
});

Deno.test("Part 2 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part2(input), 54530);
});
