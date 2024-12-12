import { wait } from "../../lib/utils.ts";
const __dirname = new URL(".", import.meta.url).pathname;

let input: string = "";
if (Deno.env.get("DEBUGGING")) {
  // for step through debugging with vscode
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
} else if (!Deno.env.get("TESTING")) {
  // we are running directly from the command line
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/********************************************************
 * Begin work, above is just some setup for debugging
 */

class Spot {
  // used only for barriers
  visited: boolean = false;

  constructor(
    public type: string,
    readonly row: number,
    readonly col: number,
  ) {}
}

type Grid = Spot[][];

const MOVE_CALC: { [key: string]: { x: number; y: number } } = {
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

const NEXT_DIR: Record<string, string> = {
  "up": "right",
  "right": "down",
  "down": "left",
  "left": "up",
};

/**
 * Converts the input string to a 2-dimensial array
 * and it also returns the starting Spot.
 */
export function makeGrid(str: string): [Grid, Spot] {
  let start: Spot;
  const grid: Grid = str.trim().split(`\n`).map((line, row) => {
    const cols = line.trim().split("").map((step, col) => {
      const gridCell = new Spot(step, row, col);
      if (step === "^") start = gridCell;
      return gridCell;
    });
    return cols;
  });
  return [grid, start!];
}

export function getVisited(grid: Grid, start: Spot): Spot[] {
  let x = start.col;
  let y = start.row;
  let dir = "up";
  const visited: Spot[] = [];

  while (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    // always add the currently visited spot
    visited.push(grid[y][x]);

    // check if the next spot ahead is a barrier or not
    const nextCoords = MOVE_CALC[dir];
    const spotAhead = grid[y + nextCoords.y]?.[x + nextCoords.x];
    if (!spotAhead) break; // stepped outside the grid
    if (spotAhead.type === "#") {
      dir = NEXT_DIR[dir];
    } else {
      y += nextCoords.y;
      x += nextCoords.x;
    }
  }

  return visited;
}

export function part1(visited: Spot[]): number {
  return new Set<Spot>(visited).size;
}

/**
 * @param start
 * @param dir the direction currently facing
 */
function checkLoop(
  grid: Grid,
  start: Spot,
  startingDir: string,
  seen: Spot[],
): boolean {
  const clone = structuredClone(grid);
  const cloneStart = clone[start.row][start.col];
  const delta = MOVE_CALC[startingDir];

  // place a temporary barrier in front of the current position in the direction walking
  clone[cloneStart.row + delta.y][cloneStart.col + delta.x].type = "#";

  const visited = new Set<Spot>();
  let x = cloneStart.col;
  let y = cloneStart.row;

  let dir = NEXT_DIR[startingDir];

  let overlapCount = 0;

  while (y >= 0 && y < clone.length && x >= 0 && x < clone[0].length) {
    const current = clone[y]?.[x];
    if (!seen.includes(current)) return false;
    if (visited.has(current)) {
      overlapCount += 1;
    } else {
      visited.add(current);
    }
    if (overlapCount > 15000) return true;

    // check if the next spot ahead is a barrier or not
    const nextCoords = MOVE_CALC[dir];
    const spotAhead = clone[y + nextCoords.y]?.[x + nextCoords.x];
    if (!spotAhead) break; // stepped outside the grid
    if (spotAhead.type === "#") {
      dir = NEXT_DIR[dir];
      // reset the overlap count at every turn
      overlapCount = 0;
    } else {
      y += nextCoords.y;
      x += nextCoords.x;
    }
  }

  return false;
}

async function canLoop(
  col: number,
  row: number,
  currentDir: string,
  grid: Grid,
): Promise<boolean> {
  if (currentDir === "up") {
    // check if there is a visited barrier to the right
    for (let x = col + 1; x < grid[0].length; x++) {
      await drawGrid(grid, { char: "X", y: row, x: col }, {
        char: "?",
        y: row,
        x,
      });
      const space = grid[row]?.[x];
      if (space?.type === "#") {
        return space.visited;
      }
    }
  }
  if (currentDir === "right") {
    // check if there is a visited barrier below
    for (let y = row + 1; y < grid.length; y++) {
      await drawGrid(grid, { char: "X", y: row, x: col }, {
        char: "?",
        y,
        x: col,
      });
      const space = grid[y]?.[col];
      if (space?.type === "#") {
        return space.visited;
      }
    }
  }
  if (currentDir === "down") {
    // check if there is a visited barrier to the left
    for (let x = col - 1; x >= 0; x--) {
      await drawGrid(grid, { char: "X", y: row, x: col }, {
        char: "?",
        y: row,
        x,
      });
      const space = grid[row]?.[x];
      if (space?.type === "#") {
        return space.visited;
      }
    }
  }
  if (currentDir === "left") {
    // check if there is a visited barrier above
    for (let y = row - 1; y >= 0; y--) {
      await drawGrid(grid, { char: "X", y: row, x: col }, {
        char: "?",
        y,
        x: col,
      });
      const space = grid[y]?.[col];
      if (space?.type === "#") {
        return space.visited;
      }
    }
  }
  return false;
}

export async function getLoops(
  grid: Grid,
  visited: Spot[],
): Promise<number> {
  let dir = "up";
  let turns = 0;
  let loops = 0;
  // retrace the visited steps and check for loops after the third turn
  for (const spot of visited) {
    await drawGrid(grid, { char: "X", y: spot.row, x: spot.col });
    const calc = MOVE_CALC[dir];
    const nextY = spot.row + calc.y;
    const nextX = spot.col + calc.x;
    const nextSpotAhead = grid[nextY]?.[nextX];

    if (!nextSpotAhead) break; // stepped outside the grid

    if (nextSpotAhead.type === "#") {
      nextSpotAhead.visited = true;
      dir = NEXT_DIR[dir];
      turns += 1;
    } else {
      if (turns >= 3 && checkLoop(grid, spot, dir, visited)) {
        loops += 1;
      }
    }
  }

  return loops;
}

/********************************************************
 * End work, below is just some setup for debugging
 * and utils for console animation
 */

if (!Deno.env.get("TESTING")) {
  const [grid, start] = makeGrid(input);
  const visited = getVisited(grid, start);
  console.log("Part 1: expected 41, actual: ", part1(visited));

  // Part 2: how many loops can we create
  const loops = getLoops(grid, visited);
  console.log("Part 2: expected 6, actual: ", loops);
}

const animate = false;
type Char = { x: number; y: number; char: string };
async function drawGrid(grid: Grid, char1?: Char, char2?: Char) {
  if (!animate) return;
  await wait(20);
  console.clear();
  const str = grid.map((row, y) => {
    return row.map((spot, x) => {
      if (char1 && x === char1.x && y === char1.y) {
        return char1.char;
      }
      if (char2 && x === char2.x && y === char2.y) {
        return char2.char;
      }
      return spot.visited && spot.type === "#" ? "Y" : spot.type;
    }).join("");
  }).join(`\n`);
  console.log(str);
}
