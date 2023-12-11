const wait = (n: number) => new Promise((res) => setTimeout(res, n));
const enc = (s: string) => new TextEncoder().encode(s);

const stack: string[] = [];
let gridCache: string[][];

export function setGrid(grid: string[][]) {
  gridCache = structuredClone(grid);
}

export function addFrame(x: number, y: number, marker: string) {
  const nextGrid: string[][] = structuredClone(gridCache);
  nextGrid[y][x] = marker;
  const display = nextGrid.map((row) => row.join("")).join("\n");
  stack.push(display);
}

export async function drawNow(x: number, y: number, marker: string) {
  console.clear();
  const nextGrid: string[][] = structuredClone(gridCache);
  nextGrid[y][x] = marker;
  const display = nextGrid.map((row) => row.join("")).join("\n");
  console.log(display);
  await wait(100);
}

export async function draw(n = 100) {
  for (const frame of stack) {
    console.clear();
    console.log(frame);
    await wait(n);
  }
}
