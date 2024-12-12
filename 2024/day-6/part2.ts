import { wait } from "../../lib/utils.ts";
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
......#...`;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 2
 */

/*
....#.....
.........#
..........
..#.......
.......#..
..........
.#.O^.....
......OO#.
#O.O......
......#O..

*/

const animate = false;

class Barrier {
  visited: boolean = false;
  constructor(readonly row: number, readonly col: number) {}
}

type Grid = (string | Barrier)[][];

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
      if (space && space instanceof Barrier) {
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
      if (space && space instanceof Barrier) {
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
      if (space && space instanceof Barrier) {
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
      if (space && space instanceof Barrier) {
        return space.visited;
      }
    }
  }
  return false;
}

async function walk(grid: Grid, [y, x]: number[]): Promise<number> {
  let dir: string = "up";

  let loops = 0;
  let turns = 0;

  while (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    await drawGrid(grid, { char: "X", y, x });
    const calc = MOVE_CALC[dir];
    const nextY = y + calc.y;
    const nextX = x + calc.x;
    const space = grid[nextY]?.[nextX];
    if (!space) break; // stepped outside the grid
    if (space instanceof Barrier) {
      space.visited = true;
      dir = NEXT_DIR[dir];
      turns += 1;
    } else {
      if (turns >= 3 && await canLoop(x, y, dir, grid)) {
        // grid[nextY][nextX] = "O";
        loops += 1;
      }
      y = nextY;
      x = nextX;
    }
  }

  return loops;
}

export async function part2(str: string): Promise<number> {
  const start: number[] = [];
  const grid: Grid = str.trim().split(`\n`).map((line, row) => {
    const cols = line.trim().split("").map((step, col) => {
      if (step === "#") return new Barrier(row, col);
      if (step === "^") start.push(row, col);
      return step;
    });
    return cols;
  });
  return await walk(grid, start);
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}

type Char = { x: number; y: number; char: string };
async function drawGrid(grid: Grid, char1?: Char, char2?: Char) {
  if (!animate) return;
  await wait(100);
  console.clear();
  const str = grid.map((row, y) => {
    return row.map((col, x) => {
      if (col instanceof Barrier) {
        return "#";
      }
      if (char1 && x === char1.x && y === char1.y) {
        return char1.char;
      }
      if (char2 && x === char2.x && y === char2.y) {
        return char2.char;
      }
      return col;
    }).join("");
  }).join(`\n`);
  console.log(str);
}
