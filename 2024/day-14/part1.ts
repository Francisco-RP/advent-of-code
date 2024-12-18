/****************************************
 * Part 1
 */

class Robot {
  p: { x: number; y: number } = { x: 0, y: 0 };
  v: { x: number; y: number } = { x: 0, y: 0 };
  constructor(str: string) {
    // p=6,3 v=-1,-3
    const [, pX, pY, vX, vY] = str.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/) || [];
    this.p = { x: parseInt(pX, 10), y: parseInt(pY, 10) };
    this.v = { x: parseInt(vX, 10), y: parseInt(vY, 10) };
  }
  calcPosition(seconds: number, gridW: number, gridH: number) {
    // Position (t) = (Initial Position) + (Velocity * Time) % Wrapping Value"
    const newX = (this.p.x + this.v.x * seconds) % gridW;
    const newY = (this.p.y + this.v.y * seconds) % gridH;
    this.p.x = newX < 0 ? newX + gridW : newX;
    this.p.y = newY < 0 ? newY + gridH : newY;
  }
}

function quadrants(robots: Robot[], gridW: number, gridH: number) {
  let topLeft = 0;
  let topRight = 0;
  let bottomLeft = 0;
  let bottomRight = 0;

  const midX = Math.floor(gridW / 2);
  const midY = Math.floor(gridH / 2);

  for (const r of robots) {
    const isLeft = r.p.x >= 0 && r.p.x < midX;
    const isRight = gridW % 2 !== 0 ? r.p.x > midX : r.p.x >= midX;
    const isTop = r.p.y >= 0 && r.p.y < midY;
    const isBottom = gridH % 2 !== 0 ? r.p.y > midY : r.p.y >= midY;
    if (isLeft && isTop) {
      topLeft += 1;
    } else if (isRight && isTop) {
      topRight += 1;
    } else if (isLeft && isBottom) {
      bottomLeft += 1;
    } else if (isRight && isBottom) {
      bottomRight += 1;
    }
  }
  // console.log(topLeft, topRight, bottomLeft, bottomRight);
  return topLeft * topRight * bottomLeft * bottomRight;
}

export async function part1(
  str: string,
  seconds: number,
  gridW: number,
  gridH: number
): Promise<number> {
  const robots = str
    .trim()
    .split(`\n`)
    .map((line) => {
      const r = new Robot(line);
      r.calcPosition(seconds, gridW, gridH);
      return r;
    });
  // console.log(robots);
  // drawGrid(robots, gridW, gridH);
  return quadrants(robots, gridW, gridH);
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
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
  `;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

if (!Deno.env.get("TESTING")) {
  // running from the command line or vscode's debugger
  console.log(await part1(input, 100, 11, 7));
}

function drawGrid(robots: Robot[], gridW: number, gridH: number) {
  const midCol = Math.floor(gridW / 2);
  const isOddCol = gridW % 2 !== 0;

  const midRow = Math.floor(gridH / 2);
  const isOddRow = gridH % 2 !== 0;

  console.log(`
expected:
......2..1.
...........
1..........
.11........
.....1.....
...12......
.1....1....

actual:
    `);
  const grid = Array(gridH)
    .fill(".")
    .map((_, y) =>
      Array(gridW)
        .fill(".")
        .map((cell, x) => {
          if (isOddCol && x === midCol) return " ";
          if (isOddRow && y === midRow) return " ";
          return cell;
        })
    );
  for (const r of robots) {
    const cell = grid[r.p.y][r.p.x];
    grid[r.p.y][r.p.x] = typeof cell === "number" ? cell + 1 : 1;
  }
  console.log(grid.map((row) => row.join("")).join(`\n`));
}
