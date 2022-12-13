const wait = (n) => new Promise((res) => setTimeout(res, n));

const stack = [];
let gridCache;

export function addToDrawStack(grid, x, y, marker) {
  if (!gridCache) {
    gridCache = structuredClone(grid);
  }
  gridCache[y][x] = marker;
  const display = gridCache.map((row) => row.join("")).join("\n");
  stack.push(display);
}

export async function draw(n = 100) {
  for (let i = 0; i < stack.length; i++) {
    console.clear();
    // console.log(stack[i]);
    process.stdout.write(stack[i] + "\n");
    await wait(n);
  }
}

export function reset() {
  gridCache = undefined;
}
