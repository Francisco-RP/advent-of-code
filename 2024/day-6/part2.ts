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

function nextDir(current: string): string {
  if (current === "up") return "right";
  if (current === "right") return "down";
  if (current === "down") return "left";
  // assumed left
  return "up";
}

function canLoop(
  col: number,
  row: number,
  dir: string,
  visited: number[][],
): boolean {
  if (dir === "up") {
    // check right, same row, greater col
    return visited.some(([x, y]) => row === y && x > col);
  }
  if (dir === "right") {
    // check down, same column, greater row
    return visited.some(([x, y]) => x === col && y > row);
  }
  if (dir === "down") {
    // check left, same row, lower column
    return visited.some(([x, y]) => y === row && x < col);
  }
  if (dir === "left") {
    // check up, same column, lower row
    return visited.some(([x, y]) => x === col && y < row);
  }
  return false;
}

function walk(grid: string[][]): number {
  let [y, x] = findStart(grid);
  let dir: string = "up";
  const barriers: number[][] = [];

  // start moving
  // track x,y positions of each #
  // after 3 turns we can start checking for possible loops
  // at each step, check if the next right turn could cause a loop by seeing if there is a
  // "#" that has already been encountered in that direction
  // for example, if heading left, check if there's a # at the same column as you but lower row
  // because up would be the next dir to cause a loop

  let loops = 0;
  let turns = 0;

  while (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
    const nextCoords = DIR[dir];
    const nextY = y + nextCoords.y;
    const nextX = x + nextCoords.x;
    const space = grid[nextY]?.[nextX];
    if (!space) break; // stepped outside the grid
    if (space === "#") {
      dir = nextDir(dir);
      barriers.push([nextX, nextY]);
      turns += 1;
    } else {
      if (turns >= 3 && canLoop(x, y, dir, barriers)) {
        loops += 1;
      }
      y = nextY;
      x = nextX;
    }
  }

  return loops;
}

export function part2(str: string): number {
  const grid = str.trim().split(`\n`).map((line) => line.trim().split(""));
  return walk(grid);
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
