import { eachSurrounding } from "../../lib/arrays.ts";
import { addFrame, draw, drawNow, setGrid } from "../../lib/animation.ts";

const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  input = `
.....
.S-7.
.|.|.
.L-J.
.....
`.trim();
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

type CardinalDirections = "N" | "S" | "E" | "W";

interface Direction extends Point {
  tile: string;
  from: CardinalDirections;
}

interface TileConnect {
  N: boolean;
  S: boolean;
  E: boolean;
  W: boolean;
}

const tiles: {
  [key: string]: TileConnect;
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
  from: CardinalDirections, // last position
): Direction {
  // where the current tile is allowed to move
  const canMove = tiles[field[y][x]];

  // each tile can only move in 2 directions. Remove the directions we don't need
  const filtered: string[] = Object.keys(canMove).filter((d) =>
    canMove[d as CardinalDirections]
  );

  for (const dir of filtered) {
    if (dir === "N" && from !== "N") {
      return {
        x,
        y: y - 1,
        tile: field[y - 1][x],
        from: "S",
      };
    }

    if (dir === "S" && from !== "S") {
      return {
        x,
        y: y + 1,
        tile: field[y + 1][x],
        from: "N",
      };
    }

    if (dir === "E" && from !== "E") {
      return {
        x: x + 1,
        y,
        tile: field[y][x + 1],
        from: "W",
      };
    }

    if (dir === "W" && from !== "W") {
      return {
        x: x - 1,
        y,
        tile: field[y][x - 1],
        from: "E",
      };
    }
  }

  return {
    x,
    y,
    tile: field[y][x],
    from,
  };
}

export async function part1(str: string): Promise<number> {
  const { field, start } = setup(str);

  setGrid(field);

  const dirs: Direction[] = [];
  eachSurrounding(start.x, start.y, field, (x, y, tile) => {
    if (tile === ".") return;
    switch (true) {
      // can we go west?
      case x === start.x - 1 && start.y === y && tiles[tile].E:
        dirs.push({ x, y, tile, from: "E" });
        break;
      // can we go east?
      case x === start.x + 1 && y === start.y && tiles[tile].W:
        dirs.push({ x, y, tile, from: "W" });
        break;
      // can we go north?
      case y === start.y - 1 && x === start.x && tiles[tile].S:
        dirs.push({ x, y, tile, from: "S" });
        break;
      // can we go south?
      case y === start.y + 1 && x === start.x && tiles[tile].N:
        dirs.push({ x, y, tile, from: "N" });
        break;
    }
  }, false);

  let [dir1] = dirs;
  let steps = 1;
  while (dir1.tile !== "S") {
    dir1 = findNext(field, dir1, dir1.from);
    steps += 1;

    // do not use for input.txt, it's too big
    // addFrame(dir1.x, dir1.y, "█");
  }

  // await draw(500);

  return steps / 2;
}

if (!Deno.env.get("TESTING")) {
  part1(input).then(console.log);
}
