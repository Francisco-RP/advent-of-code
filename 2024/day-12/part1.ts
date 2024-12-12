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

/****************************************
 * Part 1
 */

const sum = (arr: number[]): number => arr.reduce((total, n) => (total += n), 0);

// area of a region is simply the number of garden plots
// perimeter of a region is the number of outer sides
// the price of fence required for a region is found by multiplying that region's area by its perimeter
// The total price of fencing all regions on a map is found by adding together the price of fence for every region on the map.

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
    let perimeter = 0;
    const up = this.getUp(grid);
    if (!up || up.val !== this.val) perimeter += 1;

    const down = this.getDown(grid);
    if (!down || down.val !== this.val) perimeter += 1;

    const left = this.getLeft(grid);
    if (!left || left.val !== this.val) perimeter += 1;

    const right = this.getRight(grid);
    if (!right || right.val !== this.val) perimeter += 1;

    return perimeter;
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

// area of a region is simply the number of garden plots
// perimeter of a region is the number of outer sides
// the price of fence required for a region is found by multiplying that region's area by its perimeter
// The total price of fencing all regions on a map is found by adding together the price of fence for every region on the map.

export function part1(str: string): number {
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
  return calcPrice(grid, regions);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
