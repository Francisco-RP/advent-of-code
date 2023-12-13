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
): { field: string[][]; start: { x: number; y: number }; ground: number } {
  const start: { x: number; y: number } = { x: 0, y: 0 };
  let ground = 0;
  const field: string[][] = [];
  const lines = str.trim().split("\n");
  for (let row = 0; row < lines.length; row++) {
    field[row] = [];

    const line = lines[row];
    const cells = line.trim();

    for (let col = 0; col < cells.length; col++) {
      const cell = line[col];
      field[row].push(cell);

      if (cell === "S") {
        start.x = col;
        start.y = row;
      }
      if (cell === ".") {
        ground += 1;
      }
    }
  }

  return { field, start, ground };
}

export function part2(str: string): number {
  const { field, start, ground } = setup(str);
  console.log("🚀 ~ file: part2.ts:76 ~ part2 ~ start, ground:", start, ground);
  return 0;
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
