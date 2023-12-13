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
        locations[i.toString()] = { x: col, y: row };
        i += 1;
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

export function getPairDistance2(
  a: { x: number; y: number },
  b: { x: number; y: number },
  n: number,
  emptyRows: boolean[],
  emptyCols: boolean[],
) {
  let steps = 0;
  let x = a.x;
  let y = a.y;
  while (x !== b.x || y !== b.y) {
    if (x < b.x) {
      x += 1;
      steps += emptyCols[x] ? n : 1;
    } else if (x > b.x) {
      x -= 1;
      steps += emptyCols[x] ? n : 1;
    }
    if (y < b.y) {
      y += 1;
      steps += emptyRows[y] ? n : 1;
    } else if (y > b.y) {
      y -= 1;
      steps += emptyRows[y] ? n : 1;
    }
  }
  return steps;
}

export function getShortestDistance(
  locations: Locations,
  n: number,
  emptyRows: boolean[],
  emptyCols: boolean[],
): number {
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
      const distance = getPairDistance2(
        locations[keys[i]],
        locations[keys[j]],
        n,
        emptyRows,
        emptyCols,
      );
      pairs.set(pair, Math.min(distance, pairs.get(pair) ?? Infinity));
    }
  }
  return [...pairs.values()].reduce((a, b) => a + b, 0);
}

export function part2(str: string, n: number): number {
  const { locations, emptyCols, emptyRows } = setup(str);
  return getShortestDistance(locations, n, emptyRows, emptyCols);
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input, 1000000));
}
