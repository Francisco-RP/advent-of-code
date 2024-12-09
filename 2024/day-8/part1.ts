const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 1
 */

/*
..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......#...
..........
..........

the first 2 'a': [ 4, 3 ] [ 8, 4 ]
they are 4 cols and 1 row apart
so for everg 4 columns you move 1 up/down row
if location 1 is more left and above, we go up left
if location 1 is more left and below, we go down left
if location 1 is more right and above, we go up right
if location 1 is more right and below, we go down right
*/

// return distance as an array
// [x: how many cols between, y: how many rows between]
export function distance(
  [x1, y1]: number[],
  [x2, y2]: number[],
): number[] {
  return [Math.abs(x1 - x2), Math.abs(y1 - y2)];
}

function getPlacements(
  [x1, y1]: number[],
  [x2, y2]: number[],
  [diffX, diffY]: number[],
) {
  const result: number[][] = [];
  if (x1 < x2 && y1 < y2) {
    // antinode 1 gets placed up and left
    result.push([x1 - diffX, y1 - diffY]);
    // anyinode 2 gets places down and right
    result.push([x2 + diffX, y2 + diffY]);
  }
  if (x1 < x2 && y1 > y2) {
    // antinode 1 gets placed down and left
    result.push([x1 - diffX, y1 + diffY]);
    // anyinode 2 gets places up and right
    result.push([x2 + diffX, y2 - diffY]);
  }
  if (x1 > x2 && y1 < y2) {
    // antinode 1 gets placed up and right
    result.push([x1 + diffX, y1 - diffY]);
    // anyinode 2 gets places down and left
    result.push([x2 - diffX, y2 + diffY]);
  }
  if (x1 > x2 && y1 > y2) {
    // antinode 1 gets placed down and right
    result.push([x1 + diffX, y1 + diffY]);
    // anyinode 2 gets places up and left
    result.push([x2 - diffX, y2 - diffY]);
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
    const antinodes = getPlacements(a, b, d).filter((node) => {
      return node[0] >= 0 && node[0] < colLength && node[1] >= 0 &&
        node[1] < rowLength;
    });
    // console.log(antinodes);
    locations.push(...antinodes);

    right += 1;
    if (right === coords.length) {
      left += 1;
      right = left + 1;
    }
  }
  return locations;
}

export function part1(str: string): number {
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
  console.log(part1(input));
}
