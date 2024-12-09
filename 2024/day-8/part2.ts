const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 2
 */

/*
T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........
*/

// return distance as an array
// [x: how many cols between, y: how many rows between]
export function distance(
  [x1, y1]: number[],
  [x2, y2]: number[],
): number[] {
  return [Math.abs(x1 - x2), Math.abs(y1 - y2)];
}

function spots(
  startX: number,
  startY: number,
  xCalc: number,
  yCalc: number,
  colLength: number,
  rowLength: number,
): number[][] {
  const result: number[][] = [];
  let x = startX + xCalc;
  let y = startY + yCalc;
  while (x >= 0 && x < colLength && y >= 0 && y < rowLength) {
    result.push([x, y]);
    x += xCalc;
    y += yCalc;
  }
  return result;
}

function getPlacements(
  [x1, y1]: number[],
  [x2, y2]: number[],
  [diffX, diffY]: number[],
  colLength: number,
  rowLength: number,
) {
  const result: number[][] = [];
  if (x1 < x2 && y1 < y2) {
    // antinode 1 gets placed up and left
    const spots1 = spots(x1, y1, diffX * -1, diffY * -1, colLength, rowLength);
    result.push(...spots1);
    // anyinode 2 gets places down and right
    const spots2 = spots(x2, y2, diffX, diffY, colLength, rowLength);
    result.push(...spots2);
  }
  if (x1 < x2 && y1 > y2) {
    // antinode 1 gets placed down and left
    const spots1 = spots(x1, y1, diffX * -1, diffY, colLength, rowLength);
    result.push(...spots1);
    // anyinode 2 gets places up and right
    const spots2 = spots(x2, y2, diffX, diffY * -1, colLength, rowLength);
    result.push(...spots2);
  }
  if (x1 > x2 && y1 < y2) {
    // antinode 1 gets placed up and right
    const spots1 = spots(x1, y1, diffX, diffY * -1, colLength, rowLength);
    result.push(...spots1);
    // anyinode 2 gets places down and left
    const spots2 = spots(x2, y2, diffX * -1, diffY, colLength, rowLength);
    result.push(...spots2);
  }
  if (x1 > x2 && y1 > y2) {
    // antinode 1 gets placed down and right
    const spots1 = spots(x1, y1, diffX, diffY, colLength, rowLength);
    result.push(...spots1);
    // anyinode 2 gets places up and left
    const spots2 = spots(x2, y2, diffX * -1, diffY * -1, colLength, rowLength);
    result.push(...spots2);
  }
  return result;
}

function getAntinodes(coords: number[][], grid: string[][]): number[][] {
  if (coords.length < 2) return [];

  const colLength = grid[0].length;
  const rowLength = grid.length;

  const locations: number[][] = [];

  let left = 0;
  let right = 1;
  while (left < coords.length - 1 && right < coords.length) {
    const a = coords[left];
    const b = coords[right];

    const d = distance(a, b);
    // console.log(a, b, d);
    const antinodes = getPlacements(a, b, d, colLength, rowLength);
    // console.log(antinodes);
    locations.push(...antinodes, a, b);

    right += 1;
    if (right === coords.length) {
      left += 1;
      right = left + 1;
    }
  }
  return locations;
}

export function part2(str: string): number {
  const grid = str.trim().split(`\n`).map((line) => line.trim().split(""));

  // build object of antennas and all of their locations
  const antennas: { [key: string]: number[][] } = {};
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid.length; col++) {
      const cell = grid[row][col];
      if (cell !== ".") {
        if (!antennas[cell]) antennas[cell] = [];
        antennas[cell].push([col, row]);
      }
    }
  }

  const locations = new Set();
  for (const antenna in antennas) {
    const coords = antennas[antenna];
    if (Object.hasOwn(antennas, antenna)) {
      const result = getAntinodes(coords, grid);
      result.forEach((c) => {
        locations.add(c.toString());
      });
    }
  }

  return locations.size;
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
