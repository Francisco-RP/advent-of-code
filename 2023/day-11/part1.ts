import { drawArray, drawGrid } from "../../lib/draw.ts";
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

interface Locations {
  [key: string]: { x: number; y: number };
}

function setup(str: string) {
  const space = str.split("\n").map((line) => line.trim().split(""));
  return expand(space);
}

function expand(space: string[][]) {
  const emptyRows: boolean[] = Array(space.length).fill(true);
  const emptyCols: boolean[] = Array(space[0].length).fill(true);
  const locations: Locations = {};
  let i = 1;
  // find which rows and columns are empty
  for (let row = 0; row < space.length; row++) {
    for (let col = 0; col < space[row].length; col++) {
      if (space[row][col] === "#") {
        emptyRows[row] = false;
        emptyCols[col] = false;
        // rename galaxy to number
        space[row][col] = i.toString();
        i += 1;
      }
    }
  }
  // insert empty rows
  for (let i = emptyRows.length - 1; i >= 0; i--) {
    if (emptyRows[i]) {
      const newRow = Array(space[i].length).fill(".");
      space.splice(i, 0, newRow);
    }
  }
  // insert empty cols
  for (let row = 0; row < space.length; row++) {
    for (let col = space[row].length - 1; col >= 0; col--) {
      if (emptyCols[col]) {
        space[row].splice(col, 0, ".");
      }
    }
  }
  // find x,y locations of each galaxy
  for (let row = 0; row < space.length; row++) {
    for (let col = 0; col < space[row].length; col++) {
      if (space[row][col] !== ".") {
        locations[space[row][col]] = { x: col, y: row };
      }
    }
  }

  return {
    emptyRows,
    emptyCols,
    space,
    locations,
  };
}

export function getPairDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function getShortestDistance(locations: Locations): number {
  const pairsProcessed = new Set<string>();
  const pairs = new Map<string, number>();

  const keys = Object.keys(locations);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const pair = `${keys[i]}-${keys[j]}`;
      const pairReversed = `${keys[j]}-${keys[i]}`;
      if (pairsProcessed.has(pair) || pairsProcessed.has(pairReversed)) {
        continue;
      }
      pairsProcessed.add(pair);
      pairsProcessed.add(pairReversed);
      const distance = getPairDistance(locations[keys[i]], locations[keys[j]]);
      pairs.set(pair, Math.min(distance, pairs.get(pair) ?? Infinity));
    }
  }
  return [...pairs.values()].reduce((a, b) => a + b, 0);
}

export function part1(str: string): number {
  const { locations } = setup(str);
  return getShortestDistance(locations);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
