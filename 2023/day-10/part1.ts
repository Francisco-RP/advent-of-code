const __dirname = new URL(".", import.meta.url).pathname;
const { eachSurrounding } = await import("../../lib/arrays.ts");

let input: string;
if (Deno.env.get("DEBUGGING")) {
  input = await Deno.readTextFile(__dirname + "/input.txt");
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 1
 */

interface Point {
  x: number;
  y: number;
}

interface Direction extends Point {
  tile: string;
  from: Point;
}

const tiles: {
  [key: string]: { N: boolean; S: boolean; E: boolean; W: boolean };
} = {
  "|": { N: true, S: true, E: false, W: false },
  "-": { N: false, S: false, E: true, W: true },
  "L": { N: true, S: false, E: true, W: false },
  "J": { N: true, S: false, E: false, W: true },
  "7": { N: false, S: true, E: false, W: true },
  "F": { N: false, S: true, E: true, W: false },
};

function setup(
  str: string,
): { field: string[][]; start: { x: number; y: number } } {
  const start: { x: number; y: number } = { x: 0, y: 0 };
  const field = str.trim().split("\n").map((line, i) => {
    const cells = line.trim().split("");
    const x = cells.indexOf("S");
    if (x >= 0) {
      start.x = x;
      start.y = i;
    }
    return cells;
  });
  return { field, start };
}

function findNext(
  field: string[][],
  { x, y }: Point, // current position
  from: Point, // last position
): Direction {
  const next: Direction[] = [];
  const canMove = tiles[field[y][x]] || { N: true, S: true, E: true, W: true };
  eachSurrounding(x, y, field, (nextX, nextY, nextTile) => {
    if (nextTile === ".") return;
    if (nextX === from.x && nextY === from.y) {
      return;
    }

    if (nextTile === "S") {
      next.push({ x: nextX, y: nextY, tile: nextTile, from: { x, y } });
      return;
    }

    switch (true) {
      // can we go west?
      case canMove.W && nextX === x - 1 && y === nextY && tiles[nextTile].E:
        next.push({ x: nextX, y: nextY, tile: nextTile, from: { x, y } });
        break;
      // can we go east?
      case canMove.E && nextX === x + 1 && y === nextY && tiles[nextTile].W:
        next.push({ x: nextX, y: nextY, tile: nextTile, from: { x, y } });
        break;
      // can we go north?
      case canMove.N && nextY === y - 1 && x === nextX && tiles[nextTile].S:
        next.push({ x: nextX, y: nextY, tile: nextTile, from: { x, y } });
        break;
      // can we go south?
      case canMove.S && nextY === y + 1 && x === nextX && tiles[nextTile].N:
        next.push({ x: nextX, y: nextY, tile: nextTile, from: { x, y } });
        break;
    }
  }, false);

  return next[0];
}

export function part1(str: string): number {
  const { field, start } = setup(str);

  // find the first direction
  let dir1 = findNext(field, start, start);

  let steps = 1;
  while (dir1.tile !== "S") {
    dir1 = findNext(field, dir1, dir1.from);
    steps += 1;
  }

  return steps / 2;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
