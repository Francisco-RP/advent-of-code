const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = await Deno.readTextFile(__dirname + "/input.txt");
  // input = `
  // 7 6 4 2 1
  // 1 2 7 8 9
  // 9 7 6 2 1
  // 1 3 2 4 5
  // 8 6 4 4 1
  // 1 3 6 7 9
  // `.trim();
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 2
 */

function isSafe(report: number[], damp = false): boolean {
  // The levels are either all increasing or all decreasing.
  // Any two adjacent levels differ by at least one and at most three.
  // can remove 1 bad level

  // first want to check what the majority direction was for the array
  // asc or dec
  let asc = 0;
  let desc = 0;
  function check(n: number, i: number) {
    if (i === 0) return;
    const last = report[i - 1];
    last < n ? asc += 1 : desc += 1;
  }
  report.forEach(check);

  if (asc > 1 && desc > 1) return false;

  const inc = asc > desc;

  let i: number = 0;
  let j: number = 1;

  while (j < report.length) {
    const curr = report[i];
    const next = report[j];

    const isOk = inc ? curr < next : curr > next;
    if (!isOk) {
      if (!damp) {
        const left = isSafe(report.toSpliced(i, 1), true);
        const right = isSafe(report.toSpliced(j, 1), true);
        return left || right;
      } else {
        return false;
      }
    }

    const diff: number = Math.abs(curr - next);
    if (diff < 1 || diff > 3) {
      if (!damp) {
        const left = isSafe(report.toSpliced(i, 1), true);
        const right = isSafe(report.toSpliced(j, 1), true);
        return left || right;
      } else {
        return false;
      }
    }

    i += 1;
    j += 1;
  }

  return true;
}

export function part2(str: string): number {
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
  console.log(part2(input));
}
