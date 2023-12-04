import { assertStrictEquals } from "std/assert/mod.ts";
import { part1 } from "./index.ts";
import { part2 } from "./index.ts";

Deno.env.set("TESTING", "true");

Deno.test("part 1 example input", () => {
  const testInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim();
  assertStrictEquals(part1(testInput), 4361);
});

Deno.test("part 1 custom 1", () => {
  const testInput = `
.........*..................89..877*....#..572..........22............891..........295.354*864...875............=..&..706.........-.........
.......307............59............510...*....187.*247............+........#..741*..............$.......$608.316.355......*.....916....858.
..................745......705*590.......815..@...........296.....540...=..742........843.*44.......718.................309.............*...
`.trim();
  assertStrictEquals(
    part1(testInput),
    307 + 705 + 590 + 877 + 510 + 572 + 815 + 187 + 247 + 540 + 742 + 741 +
      295 +
      354 + 864 + 44 + 875 + 608 + 316 + 355 + 309 + 916 + 858,
  );
});

Deno.test("Part 1 still produces the accepted answer", async () => {
  const input = await Deno.readTextFile("./input.txt");
  assertStrictEquals(part1(input), 528819);
});

Deno.test("part 2 example input", () => {
  const testInput = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim();
  assertStrictEquals(part2(testInput), 467835);
});

Deno.test("part 2 custom 1", () => {
  const testInput = `
.........*..................89..877*....#..572..........22............891..........295.354*864...875............=..&..706.........-.........
.......307............59............510...*....187.*247............+........#..741*..............$.......$608.316.355......*.....916....858.
..................745......705*590.......815..@...........296.....540...=..742........843.*44.......718.................309.............*...
`.trim();
  assertStrictEquals(
    part2(testInput),
    (877 * 510) + (705 * 590) + (572 * 815) + (741 * 295) + (354 * 864),
  );
});

// Deno.test("Part 2 still produces the accepted answer", async () => {
//   const input = await Deno.readTextFile("./input.txt");
//   assertStrictEquals(part2(input), 111111111111111);
// });
