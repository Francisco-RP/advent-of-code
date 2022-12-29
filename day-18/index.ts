const input = await Deno.readTextFile("./input.txt");

const testInput = ``;

/***********************************************************************
 * Part 1
 */

export function part1(str: string): number {
  return 0;
}

console.time("Part 1");
const result1 = part1(input);
console.timeEnd("Part 1");
console.log("Result 1:", result1);

if (Deno.env.get("DEBUGGING") === "true") {
  const testInput = `

  `;

  part1(testInput);
}
