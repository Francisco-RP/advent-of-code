import { processLine } from "./part1.ts";

const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 2
 *
 * This part was really easy because I anticipated that a new
 * operator would be added in part 2 so I just updated the
 * calc function in part 1 to handle the new operator and
 * that's it. only a 1 line change to make it work
 */

export function part2(str: string): number {
  const equations = str.trim().split(`\n`);
  let result = 0;
  for (const eq of equations) {
    result += processLine(eq, ["+", "*", "||"]);
  }
  return result;
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
