const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 1
 */

function setup(str: string): string[] {
  return str.split("\n").map((line) => line.trim());
}

function processSprings(springs: string[], groupSizes: number[]): number {
  console.log(springs);
  console.log(groupSizes);
  return 0;
}

function processLine(line: string): number {
  // operational (.) or damaged (#) or unknown (?)
  const [left, right] = line.split(" ");
  const springs = left.replace(/^\.+/, "").replace(/\.+$/, "").split(/\.+/);
  const groupSizes = right.split(",").map(Number);
  return processSprings(springs, groupSizes);
}

export function part1(str: string): number {
  const lines = setup(str);
  return lines.reduce((sum, line) => sum + processLine(line), 0);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
