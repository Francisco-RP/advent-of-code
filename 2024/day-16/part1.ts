import { type Point, type CalcH, a_star, IsSpace, manhattanDistance } from "./a-star.ts";
/****************************************
 * Part 1
 *
 * Seems like we need some kind of path finding
 * A* should work with the heuristic being the cost
 * of the movement
 */

const START = "S";
const END = "E";
const WALL = "#";
const SPACE = ".";

type Map = string[][];

function parseInput(str: string): { map: Map; start: Point; end: Point; allSpaces: Point[] } {
  let start: Point = [-1, -1];
  let end: Point = [-1, -1];
  const allSpaces: Point[] = [];

  const map = str
    .trim()
    .split(`\n`)
    .map((row, y) => {
      return row.split("").map((char, x) => {
        const point: Point = [x, y];

        if (char === START) {
          point.push(">");
          start = point;
        } else if (char === END) {
          end = point;
        }

        if (char !== WALL) allSpaces.push(point);
        return char;
      });
    });
  return { map, start, end, allSpaces };
}

/*
The Reindeer start on the Start Tile (marked S) facing East and need to reach the End Tile (marked E). 
They can move forward one tile at a time (increasing their score by 1 point), but never into a wall (#). 
They can also rotate clockwise or counterclockwise 90 degrees at a time (increasing their score by 1000 points).
*/

// rotate = 1000
// move = 1

function heuristic(p: Point, end: Point): number {
  return manhattanDistance(p, end);
}

function getCost(path: Point[]): number {
  let result = 0;

  let lastDir = ">";
  let last = path.shift()!;
  for (const next of path) {
    switch (true) {
      case last[0] < next[0] && last[1] === next[1]: {
        // heading >
        if (lastDir === ">") {
          result += 1;
        } else {
          result += 1001;
          lastDir = ">";
        }
        break;
      }
      case last[0] > next[0] && last[1] === next[1]: {
        // heading <
        if (lastDir === "<") {
          result += 1;
        } else {
          result += 1001;
          lastDir = "<";
        }
        break;
      }
      case last[0] === next[0] && last[1] < next[1]: {
        // heading v
        if (lastDir === "v") {
          result += 1;
        } else {
          result += 1001;
          lastDir = "v";
        }
        break;
      }
      case last[0] === next[0] && last[1] > next[1]:
      default: {
        // heading ^
        if (lastDir === "^") {
          result += 1;
        } else {
          result += 1001;
          lastDir = "^";
        }
        break;
      }
    }
    last = next;
  }

  return result;
}

export async function part1(str: string): Promise<number> {
  const { map, start, end, allSpaces } = parseInput(str);
  const isSpace: IsSpace = (point: Point) =>
    map[point[1]][point[0]] === SPACE || map[point[1]][point[0]] === END;
  const h: CalcH = (p: Point) => heuristic(p, end);
  const path = a_star(allSpaces, start, end, h, isSpace);

  // console.log(path, path.length);
  // drawPath(map, path);

  return getCost(path);
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
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############  
`;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

if (!Deno.env.get("TESTING")) {
  // running from the command line or vscode's debugger
  console.log(await part1(input));
}

function drawPath(map: Map, path: Point[]) {
  for (const [x, y, d] of path) {
    map[y][x] = d || "-";
  }
  const str = map.map((row) => row.join("")).join(`\n`);
  console.log(str);
}
