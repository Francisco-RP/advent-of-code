import { assertStrictEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Blueprint, part1 } from "./index.ts";
// import { part2 } from ".";

const input = await Deno.readTextFile("./input.txt");

const testInput = `
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`;

Deno.test({
  name: "Blueprint returns the right quality level",
  only: true,
  fn() {
    const costs = {
      blueprintId: 1,
      oreRobot: { ore: 4 },
      clayRobot: { ore: 2 },
      obsidianRobot: { ore: 3, clay: 14 },
      geodeRobot: { ore: 2, obsidian: 7 },
    };
    const bp = new Blueprint(costs);
    bp.begin();
    assertStrictEquals(bp.getQualityLevel(), 9);
  },
});

Deno.test("part 1 example input", () => {
  assertStrictEquals(part1(testInput), 33);
});

// Deno.test("Part 1 still produces the accepted answer", () => {
//   assertStrictEquals(part1(input), 111111111111111);
// });

// Deno.test("part 2 example input", () => {
//   assertStrictEquals(part2(testInput), 1111111111111);
// });

// Deno.test("Part 2 still produces the accepted answer", () => {
//   assertStrictEquals(part2(input), 111111111111111);
// });
