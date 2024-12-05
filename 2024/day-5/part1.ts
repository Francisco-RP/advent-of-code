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

function processRules(str: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  str.split(`\n`).forEach((line) => {
    const [left, right] = line.trim().split("|");
    if (!map.has(left)) map.set(left, []);
    const arr = map.get(left)!;
    arr.push(right);
    map.set(left, arr);
  });
  return map;
}

function checkUpdate(map: Map<string, string[]>, update: string[]): boolean {
  let left = 0;
  let right = 1;
  while (left < update.length - 1) {
    const page1 = update[left];
    const page2 = update[right];
    if (!map.has(page1) || !map.get(page1)?.includes(page2)) {
      return false;
    }
    right += 1;
    if (right === update.length) {
      left += 1;
      right = left + 1;
    }
  }
  return true;
}

function processUpdates(map: Map<string, string[]>, str: string): string[][] {
  const updates = str.split(`\n`).map((line) => line.trim().split(","));

  const result: string[][] = [];
  for (let i = 0; i < updates.length; i++) {
    if (checkUpdate(map, updates[i])) {
      result.push(updates[i]);
    }
  }

  return result;
}

function addMiddles(updates: string[][]): number {
  let sum = 0;
  for (const up of updates) {
    const middle = Math.floor(up.length / 2);
    sum += parseInt(up[middle]);
  }
  return sum;
}

export function part1(str: string): number {
  const [rules, updates] = str.trim().split(`\n\n`);
  const map = processRules(rules);
  const results = processUpdates(map, updates);
  return addMiddles(results);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
