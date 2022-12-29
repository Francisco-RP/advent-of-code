import { assertStrictEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { part1 } from "./index.ts";
// import { part2 } from ".";

const input = await Deno.readTextFile("./input.txt");

const testInput = `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;

Deno.test("part 1 example input", () => {
  assertStrictEquals(part1(testInput), 1651);
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
