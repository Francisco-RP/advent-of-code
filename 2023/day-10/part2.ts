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
): { field: string[][]; start: { x: number; y: number } } {
  const start: { x: number; y: number } = { x: 0, y: 0 };
  const field = str.trim().split("\n").map((line, i) => {
    const cells = line.trim().split("");
    const x = cells.indexOf("S");
    if (x >= 0) {
      start.x = x;
      start.y = i;
    }
    return cells;
  });
  return { field, start };
}

export function part2(str: string): number {
  const { field, start } = setup(str);
  return 0;
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
