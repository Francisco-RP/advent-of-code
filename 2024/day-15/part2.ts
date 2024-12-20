import { wait } from "../../lib/utils.ts";
import { sum } from "../../lib/arrays.ts";
/****************************************
 * Part 2
 */

type Map = (string | Box)[][];

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

class Box {
  leftEdge: Box | undefined;
  rightEdge: Box | undefined;
  constructor(public x: number, public y: number, public char: string) {}

  getNext(map: Map, dir: string): string | Box {
    const moveCalc = DIR[dir];
    const aboveThis = map[this.y + moveCalc.y][this.x + moveCalc.x];
    return aboveThis;
  }

  // this is only use during up/down check to get what's above/below both sides
  getNextBothSides(map: Map, dir: string): [string | Box, string | Box] {
    return [
      this.getNext(map, dir),
      this.leftEdge?.getNext(map, dir) || this.rightEdge!.getNext(map, dir),
    ];
  }

  /**
   * The GPS coordinate of a box is equal to 100 times its distance from the top edge
   * plus its distance from the left edge of the map.
   */
  gps() {
    return 100 * this.y + this.x;
  }
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
        const item = row[i];
        if (item instanceof Box) {
          item.x -= 1;
        }
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
        const toMove = row[i - 1];
        row[i] = toMove;
        if (toMove instanceof Box) {
          toMove.x += 1;
        }
      }
      // and the original position of the robot is now empty
      row[x] = SPACE;
      return true;
    }
    col = col + 1;
  }
  return false;
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
  const boxesAbove: Set<Box> = new Set();
  for (const item of items) {
    const [x, y] = item;
    const thingAbove = map[y + calc][x];

    if (thingAbove === WALL) return false; // can't move up

    if (thingAbove instanceof Box) {
      boxesAbove.add(thingAbove);
      if (thingAbove.leftEdge) boxesAbove.add(thingAbove.leftEdge);
      else if (thingAbove.rightEdge) boxesAbove.add(thingAbove.rightEdge);
    }
  }

  if (boxesAbove.size === 0) {
    // no boxes or wall above that means we can move all these up/down
    for (const item of items) {
      const [x, y] = item;
      const thing = map[y][x];
      map[y + calc][x] = thing;
      if (thing instanceof Box) {
        thing.y += calc;
      }
      map[y][x] = SPACE;
    }
    return true;
  } else {
    // we need to check the next
    const nextRow = checkVertical(
      map,
      [...boxesAbove].map((b) => [b.x, b.y]),
      dir
    );
    if (nextRow) {
      for (const item of items) {
        const [x, y] = item;
        const thing = map[y][x];
        map[y + calc][x] = thing;
        map[y][x] = SPACE;
        if (thing instanceof Box) {
          thing.y += calc;
        }
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
    // console.clear();
    // console.log("next move:", nextMove);
    // draw(map);
    // await wait(300);

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

function parseMap(str: string): { map: Map; start: number[]; boxes: Box[] } {
  const start: number[] = [];
  const boxes: Box[] = [];
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
            const bLeft = new Box(newIndex, y, BOX_LEFT);
            const bRight = new Box(newIndex + 1, y, BOX_RIGHT);
            // link the box sides to each other
            bLeft.rightEdge = bRight;
            bRight.leftEdge = bLeft;

            boxes.push(bLeft); // we don't care about the right edges
            map.at(-1)?.push(bLeft, bRight);
            return;
          }
          if (cell === ROBOT) {
            map.at(-1)?.push(cell, SPACE);
            start.push(newIndex, y);
            return;
          }
          map.at(-1)?.push(cell, cell);
        });
    });
  return { map, start, boxes };
}

export async function part2(str: string): Promise<number> {
  const [mapRaw, movesRaw] = str.trim().split(`\n\n`);
  const { map, start, boxes } = parseMap(mapRaw);
  const moves = movesRaw.trim().replaceAll(/\n/g, "");
  await moveRobot(map, start, moves);
  return sum(boxes.map((b) => b.gps()));
}

/****************************************
 * Drawing to the console utils to
 * help visualize the map
 */

function draw(map: Map) {
  const gridStr = map
    .map((row) => {
      return row
        .map((col) => {
          if (col instanceof Box) {
            return col.char;
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
