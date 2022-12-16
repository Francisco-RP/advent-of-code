import { part1 } from "./part1.ts";
import { part2 } from "./part2.ts";

const input = await Deno.readTextFile("./input.txt");

// console.time("Part 1");
// const result1 = part1(input, 2000000);
// console.timeEnd("Part 1");
// console.log("Result 1:", result1);

console.time("Part 2");
const result2 = part2(input);
console.timeEnd("Part 2");
console.log("Result 2:", result2);
