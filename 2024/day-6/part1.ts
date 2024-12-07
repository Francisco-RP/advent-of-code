const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
  `;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 1
 */

function findStart(grid: string[][]): [row: number, col: number] {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "^") {
        return [row, col];
      }
    }
  }
  return [0, 0];
}

type directions = "up" | "down" | "left" | "right";

const DIR: { [key: string]: { x: number; y: number } } = {
  up: {
    x: 0,
    y: -1,
  },
  down: {
    x: 0,
    y: 1,
  },
  left: {
    x: -1,
    y: 0,
  },
  right: {
    x: 1,
    y: 0,
  },
};

function nextDir(current: directions): directions {
  if (current === "up") return "right";
  if (current === "right") return "down";
  if (current === "down") return "left";
  // assumed left
  return "up";
}

function walk(grid: string[][]): number {
  const pos = new Set<string>();

  let [y, x] = findStart(grid);
  pos.add(`${y},${x}`);
  let dir: directions = "up";

  while (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    const nextCoords = DIR[dir];
    const space = grid[y + nextCoords.y]?.[x + nextCoords.x];
    if (!space) break; // stepped outside the grid
    if (space === "#") {
      dir = nextDir(dir);
    } else {
      y += nextCoords.y;
      x += nextCoords.x;
      pos.add(`${y},${x}`);
    }
  }

  return pos.size;
}

export function part1(str: string): number {
  const grid = str.trim().split(`\n`).map((line) => line.trim().split(""));
  return walk(grid);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
