import { wait } from "../../lib/utils.ts";
/****************************************
 * Part 2
 */

class Robot {
  p: { x: number; y: number } = { x: 0, y: 0 };
  v: { x: number; y: number } = { x: 0, y: 0 };
  origin: { x: number; y: number } = { x: 0, y: 0 };
  constructor(str: string) {
    // p=6,3 v=-1,-3
    const [, pX, pY, vX, vY] = str.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/) || [];
    this.p = { x: parseInt(pX, 10), y: parseInt(pY, 10) };
    this.origin = { ...this.p };
    this.v = { x: parseInt(vX, 10), y: parseInt(vY, 10) };
  }
  reset() {
    this.p = { ...this.origin };
  }
  move(time: number, gridW: number, gridH: number) {
    const newX = (this.p.x + this.v.x * time) % gridW;
    const newY = (this.p.y + this.v.y * time) % gridH;
    this.p.x = newX < 0 ? newX + gridW : newX;
    this.p.y = newY < 0 ? newY + gridH : newY;
  }
}

// the answer was 7603
export async function part2(str: string, gridW: number, gridH: number): Promise<number> {
  const robots = str
    .trim()
    .split(`\n`)
    .map((line) => new Robot(line));

  let i = 7600;
  while (i < 7605) {
    for (const r of robots) {
      r.reset();
      r.move(i, gridW, gridH);
    }
    await wait(1000);
    drawGrid(robots, gridW, gridH);
    console.log(i);
    i += 1;
  }
  // drawGrid(robots, gridW, gridH);
  return 0;
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
  console.log(await part2(input, 11, 7));
}

function drawGrid(robots: Robot[], gridW: number, gridH: number) {
  console.clear();
  const grid = Array(gridH)
    .fill(".")
    .map(() => Array(gridW).fill("."));
  for (const r of robots) {
    const cell = grid[r.p.y][r.p.x];
    grid[r.p.y][r.p.x] = typeof cell === "number" ? cell + 1 : 1;
  }
  console.log(grid.map((row) => row.join("")).join(`\n`));
}
