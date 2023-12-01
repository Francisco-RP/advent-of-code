import { part1 } from "./index.ts";

const input = await Deno.readTextFile("./input.txt");

console.time("Part 1");
const result1 = part1(input);
console.timeEnd("Part 1");
console.log("Result 1:", result1);
