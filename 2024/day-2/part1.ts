import { reset } from "std/fmt/colors.ts";

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

function isSafe(report: number[]): boolean {
  //   The levels are either all increasing or all decreasing.
  // Any two adjacent levels differ by at least one and at most three.
  const inc: boolean = report[0] < report.at(-1)!;
  for (let i = 0; i < report.length - 1; i++) {
    const curr = report[i];
    const next = report[i + 1];
    if (inc) {
      if (curr > next) return false;
      const diff = next - curr;
      if (diff < 1 || diff > 3) return false;
    } else {
      if (curr < next) return false;
      const diff = curr - next;
      if (diff < 1 || diff > 3) return false;
    }
  }

  return true;
}

export function part1(str: string): number {
  const reports: number[][] = str.trim().split(`\n`).map((line) => {
    return line.trim().split(" ").map(Number);
  });
  let result = 0;
  for (let i = 0; i < reports.length; i++) {
    if (isSafe(reports[i])) result += 1;
  }
  return result;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
