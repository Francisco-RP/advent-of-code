import { wait } from "../../lib/utils.ts";
import { sum } from "../../lib/arrays.ts";
/****************************************
 * Part 1
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

const DIR: { [key: string]: { x: number; y: number } } = {
  [UP]: { x: 0, y: -1 },
  [LEFT]: { x: -1, y: 0 },
  [RIGHT]: { x: 1, y: 0 },
  [DOWN]: { x: 0, y: 1 },
};

class Box {
  constructor(public x: number, public y: number) {}

  move(moveCalc: { x: number; y: number }) {
    this.x += moveCalc.x;
    this.y += moveCalc.y;
  }

  /**
   * The GPS coordinate of a box is equal to 100 times its distance from the top edge
   * plus its distance from the left edge of the map.
   */
  gps() {
    return 100 * this.y + this.x;
  }
}

/**
 * maybe we can do this recursively
 * @param map the map, passed by reference
 * @param pos position of the box or robot
 * @param nextPos position of the item in front of the box or robot
 * @param moveCalc the calculation of movement
 */
function handleBox(
  map: Map,
  pos: number[],
  nextPos: number[],
  moveCalc: { x: number; y: number }
): boolean {
  const [currentX, currentY] = pos;
  const [aheadX, aheadY] = nextPos;
  const itemToMove = map[currentY][currentX]; // can be the robot or a box
  const thingAhead = map[aheadY][aheadX]; // can be box, space, or wall

  if (thingAhead instanceof Box) {
    const next = [thingAhead.x + moveCalc.x, thingAhead.y + moveCalc.y];
    const canMoveBox = handleBox(map, [aheadX, aheadY], next, moveCalc);
    if (canMoveBox) {
      // move the current box over one
      map[currentY][currentX] = SPACE;
      map[aheadY][aheadX] = itemToMove;
      if (itemToMove instanceof Box) {
        itemToMove.move(moveCalc);
      }
    }
    return canMoveBox;
  }

  if (thingAhead === SPACE) {
    // we can move this thing into that space
    map[currentY][currentX] = SPACE;
    map[aheadY][aheadX] = itemToMove;
    if (itemToMove instanceof Box) {
      itemToMove.move(moveCalc);
    }
    return true;
  }

  // it's a wall so we stop
  return false;
}

// using async to help with animating the moves in the console
async function moveRobot(map: Map, start: number[], moves: string): Promise<Map> {
  let i = 0;
  let pos = [...start];
  while (i < moves.length) {
    const nextMove = moves.charAt(i);
    const moveCalc = DIR[nextMove];
    const [currentX, currentY] = pos;
    const newX = currentX + moveCalc.x;
    const newY = currentY + moveCalc.y;
    const spotAhead = map[newY][newX];
    // if box, move box or boxes in some row or col
    if (spotAhead === WALL) {
      // do nothing, can't move
    } else if (spotAhead === SPACE) {
      // just move the robot
      map[currentY][currentX] = SPACE;
      map[newY][newX] = ROBOT;
      pos = [newX, newY];
    } else {
      // we've hit a box, this is the most complicated state
      const moved = handleBox(map, pos, [newX, newY], moveCalc);
      if (moved) {
        pos = [newX, newY];
      }
    }
    // console.clear();
    // draw(map);
    // await wait(300);
    i += 1;
  }
  return map; // the updated map
}

export async function part1(str: string): Promise<number> {
  const [mapRaw, movesRaw] = str.trim().split(`\n\n`);
  /**
   * The starting position of the robot
   */
  const start: number[] = [];

  /**
   * Store all boxes in an array for easy summing up later
   */
  const boxes: Box[] = [];

  // process the input
  const map = mapRaw
    .trim()
    .split(`\n`)
    .map((line, y) => {
      return line
        .trim()
        .split("")
        .map((cell, x) => {
          if (cell === BOX) {
            const b = new Box(x, y);
            boxes.push(b);
            return b;
          }
          if (cell === ROBOT) {
            start.push(x, y);
          }
          return cell;
        });
    });
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
          if (col instanceof Box) return BOX;
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
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<  
`;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

if (!Deno.env.get("TESTING")) {
  // running from the command line or vscode's debugger
  console.log(await part1(input));
}
