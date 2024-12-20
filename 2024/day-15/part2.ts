import { wait } from "../../lib/utils.ts";
/****************************************
 * Part 2
 */

const animate = false;

type Map = string[][];

const UP = "^";
const LEFT = "<";
const RIGHT = ">";
const DOWN = "v";
const ROBOT = "@";
const BOX = "O";
const WALL = "#";
const SPACE = ".";
const BOX_LEFT = "[";
const BOX_RIGHT = "]";

const DIR: { [key: string]: { x: number; y: number } } = {
  [UP]: { x: 0, y: -1 },
  [LEFT]: { x: -1, y: 0 },
  [RIGHT]: { x: 1, y: 0 },
  [DOWN]: { x: 0, y: 1 },
};

function gps(x: number, y: number): number {
  return 100 * y + x;
}

function checkLeft(map: Map, robotPos: number[]): boolean {
  const [x, y] = robotPos;
  const row = map[y];
  let col = x - 1;
  while (row[col] !== WALL) {
    if (row[col] === SPACE) {
      // everything to the right between here and the robot can be moved left one space
      // including the robot
      for (let i = col; i <= x; i++) {
        row[i] = row[i + 1];
      }
      // and the original position of the robot is now empty
      row[x] = SPACE;
      return true;
    }
    col = col - 1;
  }
  return false;
}

function checkRight(map: Map, robotPos: number[]) {
  const [x, y] = robotPos;
  const row = map[y];
  let col = x + 1;
  while (row[col] !== WALL) {
    if (row[col] === SPACE) {
      // everything to the left between here and the robot can be moved right one space
      // including the robot
      for (let i = col; i >= x; i--) {
        row[i] = row[i - 1];
      }
      // and the original position of the robot is now empty
      row[x] = SPACE;
      return true;
    }
    col = col + 1;
  }
  return false;
}

function dupeCheck(x: number, y: number, boxes: number[][]): boolean {
  return !!boxes.find((box) => box[0] === x && box[1] === y);
}

/**
 * recursive function to check if the robot can move up
 * @param map
 * @param items
 * @returns
 */
function checkVertical(map: Map, items: number[][], dir: string): boolean {
  /*
In this function, all of the boxes need to be checked to see if they can move up because the
edges are above another box
........... 
..[][][]... 
.[][]...... 
[]......... 
@.......... 

if the move is ^, it becomes this:
..[].......
.[].[][]... 
[].[]...... 
@..........
...........
  */
  const calc = dir === UP ? -1 : 1;
  const boxesAbove: number[][] = [];
  for (const item of items) {
    const [x, y] = item;
    const nextY = y + calc;
    const thingAbove = map[nextY][x];

    if (thingAbove === WALL) {
      return false;
    } else if (thingAbove === BOX_LEFT) {
      if (!dupeCheck(x, nextY, boxesAbove)) {
        boxesAbove.push([x, nextY]);
      }
      if (!dupeCheck(x + 1, nextY, boxesAbove)) {
        boxesAbove.push([x + 1, nextY]);
      }
      // also push its right side
    } else if (thingAbove === BOX_RIGHT) {
      if (!dupeCheck(x, nextY, boxesAbove)) {
        boxesAbove.push([x, nextY]);
      }
      if (!dupeCheck(x - 1, nextY, boxesAbove)) {
        boxesAbove.push([x - 1, nextY]);
      }
    }
  }

  if (boxesAbove.length === 0) {
    // no boxes or wall above that means we can move all these up/down
    for (const item of items) {
      const [x, y] = item;
      const thing = map[y][x];
      map[y + calc][x] = thing;
      map[y][x] = SPACE;
      // help me out here
    }
    return true;
  } else {
    // we need to check the next
    const nextRow = checkVertical(map, boxesAbove, dir);
    if (nextRow) {
      for (const item of items) {
        const [x, y] = item;
        const thing = map[y][x];
        map[y + calc][x] = thing;
        map[y][x] = SPACE;
      }
    }
    return nextRow;
  }
}

// using async to help with animating the moves in the console
async function moveRobot(map: Map, start: number[], moves: string): Promise<Map> {
  let i = 0;
  let pos = [...start];
  let moved = false;
  while (i < moves.length) {
    const nextMove = moves.charAt(i);

    if (animate) {
      console.clear();
      console.log("move index:", i);
      draw(map, nextMove);
      await wait(200);
    }

    switch (nextMove) {
      case LEFT:
        moved = checkLeft(map, pos);
        break;
      case RIGHT:
        moved = checkRight(map, pos);
        break;
      case UP:
      case DOWN:
        moved = checkVertical(map, [pos], nextMove);
        break;
    }

    if (moved) {
      const moveCalc = DIR[nextMove];
      const [currentX, currentY] = pos;
      const newX = currentX + moveCalc.x;
      const newY = currentY + moveCalc.y;
      pos = [newX, newY];
    }

    i += 1;
  }
  return map; // the updated map
}

function parseMap(str: string): { map: Map; start: number[] } {
  const start: number[] = [];
  const map: Map = [];

  str
    .trim()
    .split(`\n`)
    .forEach((row, y) => {
      map.push([]);

      return row
        .trim()
        .split("")
        .forEach((cell) => {
          const newIndex = map.at(-1)!.length;
          if (cell === BOX) {
            map.at(-1)?.push(BOX_LEFT, BOX_RIGHT);
            return;
          }
          if (cell === ROBOT) {
            map.at(-1)?.push(cell, SPACE);
            start.push(newIndex, y);
            return;
          }
          // it's a wall
          map.at(-1)?.push(cell, cell);
        });
    });
  return { map, start };
}

function calcSolution(map: Map): number {
  let result = 0;
  map.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === BOX_LEFT) {
        result += gps(x, y);
      }
    });
  });
  return result;
}

export async function part2(str: string): Promise<number> {
  const [mapRaw, movesRaw] = str.trim().split(`\n\n`);
  const { map, start } = parseMap(mapRaw);
  const moves = movesRaw.trim().replaceAll(/\n/g, "");
  await moveRobot(map, start, moves);
  return calcSolution(map);
}

/****************************************
 * Drawing to the console utils to
 * help visualize the map
 */

function draw(map: Map, move: string) {
  const gridStr = map
    .map((row) => {
      return row
        .map((col) => {
          if (col === ROBOT) {
            return move;
          }
          return col;
        })
        .join("");
    })
    .join(`\n`);
  console.log(gridStr);
}

/****************************************
 * Ignore below
 * it's for debugging
 */

const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

if (!Deno.env.get("TESTING")) {
  // running from the command line or vscode's debugger
  console.log(await part2(input));
}
