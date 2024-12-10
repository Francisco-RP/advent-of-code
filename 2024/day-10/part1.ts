const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = `
0123
1234
8765
9876
  `;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 1
 */

class Node {
  visited: boolean = false;
  constructor(readonly n: number, readonly row: number, readonly col: number) {}
}

function search(grid: Node[][], startNode: Node): number {
  reset(grid);
  let count = 0;
  const stack = [startNode];
  while (stack.length) {
    const next = stack.pop();
    if (!next) continue;
    next.visited = true;
    if (next.n === 9) {
      count += 1;
    } else {
      // get all neighbords that are next.n + 1
      const nextStep = next.n + 1;
      // up
      const up = grid[next.row - 1]?.[next.col];
      if (up && up.n === nextStep && !up.visited) {
        stack.push(up);
      }
      // down
      const down = grid[next.row + 1]?.[next.col];
      if (down && down.n === nextStep && !down.visited) {
        stack.push(down);
      }
      // left
      const left = grid[next.row]?.[next.col - 1];
      if (left && left.n === nextStep && !left.visited) {
        stack.push(left);
      }
      // right
      const right = grid[next.row]?.[next.col + 1];
      if (right && right.n === nextStep && !right.visited) {
        stack.push(right);
      }
    }
  }

  return count;
}

function allStarts(grid: Node[][]): Node[] {
  const starts: Node[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col].n === 0) {
        starts.push(grid[row][col]);
      }
    }
  }
  return starts;
}

function reset(grid: Node[][]) {
  grid.forEach((row) => {
    row.forEach((col) => {
      col.visited = false;
    });
  });
}

export function part1(str: string): number {
  const grid: Node[][] = str.trim().split(`\n`).map((line, row) =>
    line.trim().split("").map((n, col) => {
      const num = Number(n);
      return new Node(num, row, col);
    })
  );

  const startingPositions = allStarts(grid);
  const results = startingPositions.map((node) => search(grid, node));
  return results.reduce((sum, n) => sum += n, 0);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
