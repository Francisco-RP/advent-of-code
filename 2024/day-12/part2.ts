import { wait } from "../..//lib/utils.ts";

/****************************************
 * Part 2
 */

const sum = (arr: number[]): number => arr.reduce((total, n) => (total += n), 0);

class Plot {
  visited = false;

  constructor(public val: string, public row: number, public col: number) {}

  getUp(grid: Grid): Plot | undefined {
    return grid[this.row - 1]?.[this.col];
  }
  getDown(grid: Grid): Plot | undefined {
    return grid[this.row + 1]?.[this.col];
  }
  getLeft(grid: Grid): Plot | undefined {
    return grid[this.row]?.[this.col - 1];
  }
  getRight(grid: Grid): Plot | undefined {
    return grid[this.row]?.[this.col + 1];
  }

  getPerimeter(grid: Grid): number {
    let corners = 0;
    const up = this.getUp(grid)?.val;
    const down = this.getDown(grid)?.val;
    const left = this.getLeft(grid)?.val;
    const right = this.getRight(grid)?.val;

    if (up === left && up !== this.val) {
      corners += 1;
    }
    if (up === right && up !== this.val) {
      corners += 1;
    }
    if (down === right && down !== this.val) {
      corners += 1;
    }
    if (down === left && down !== this.val) {
      corners += 1;
    }
    return corners;
  }

  getSameRegionNeighbors(grid: Grid): Plot[] {
    const neighbors: Plot[] = [];

    const right = this.getRight(grid);
    if (right?.val === this.val && !right.visited) neighbors.push(right);

    const down = this.getDown(grid);
    if (down?.val === this.val && !down.visited) neighbors.push(down);

    const up = this.getUp(grid);
    if (up?.val === this.val && !up.visited) neighbors.push(up);

    const left = this.getLeft(grid);
    if (left?.val === this.val && !left.visited) neighbors.push(left);

    return neighbors;
  }
}

type Grid = Plot[][];

/*
EEEEE
EXXXX
EEEEE
EXXXX
EEEEE

EEEEE  
E       XXXX
EEEEE  
E       XXXX
EEEEE  

if there's no same above and to the left, corner ++

take a simple slice,  this has 6 sides
EE
E

...
.E. <- 4 corners
...

...
.E. <- 4 corners
...

if both up and left are not val
if both right and down ARE val, check if




AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA

AAAAAA  
AAA  A     BB
AAA  A     BB
A  AAA   BB
A  AAA   BB
AAAAAA  

*/

function getNextRegionStart(grid: Grid): Plot | undefined {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (!grid[row][col].visited) return grid[row][col];
    }
  }
}

function getRegion(grid: Grid, start: Plot): Plot[] {
  const region: Plot[] = [];

  const stack = [start];

  while (stack.length) {
    const next = stack.shift();
    if (next) {
      if (next.visited) continue;
      next.visited = true;
      region.push(next);
      const neighbors = next.getSameRegionNeighbors(grid);
      stack.push(...neighbors);
    }
  }

  return region;
}

function getAllRegions(grid: Grid): Plot[][] {
  const regions: Plot[][] = [];

  let start: Plot | undefined = grid[0][0];
  let region = 0;

  while (start) {
    regions[region] = getRegion(grid, start);
    region += 1;
    start = getNextRegionStart(grid);
  }

  return regions;
}

function calcPrice(grid: Grid, regions: Plot[][]): number {
  const pricePer = regions.map((region) => {
    const perimeter = region.reduce((acc, plot) => {
      const cellPermiter = plot.getPerimeter(grid);
      return acc + cellPermiter;
    }, 0);
    return perimeter * region.length;
  });
  return sum(pricePer);
}

export async function part2(str: string): Promise<number> {
  const grid = str
    .trim()
    .split(`\n`)
    .map((line, row) => {
      return line
        .trim()
        .split("")
        .map((cell, col) => {
          return new Plot(cell, row, col);
        });
    });
  const regions = getAllRegions(grid);
  console.log(regions);
  // await drawRegion(grid, regions[0]);
  return calcPrice(grid, regions);
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
AAAA
BBCD
BBCC
EEEC
`;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}

async function drawRegion(grid: Grid, region: Plot[]) {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = Array(rows)
    .fill(".")
    .map(() => Array(cols).fill("."));

  for (const plot of region) {
    console.clear();
    newGrid[plot.row][plot.col] = plot.val;
    console.log(newGrid.map((line) => line.join("")).join(`\n`));
    await wait(100);
  }
}
