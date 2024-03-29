const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  input = `
LR
  
11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
  `.trim();
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 2
 */

type Instrunction = "R" | "L";

interface Mappings {
  [key: string]: { L: string; R: string };
}

function setup(
  str: string,
): { instructions: Instrunction[]; map: Mappings; start: string[] } {
  const lines = str.trim().split(`\n`);

  // first line is instructions
  const instructions = lines.shift()?.trim().split("") as Instrunction[] || [];

  // 2nd line is blank
  lines.shift();

  // the rest are the mappings
  const map: Mappings = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [node, left, right] = line.match(/[0-9A-Z]{3}/g) || [];
    if (node && left && right) {
      map[node] = { L: left, R: right };
    } else {
      // this should never happen, need to fix something if we see it
      console.log("line skipped", line);
    }
  }

  // create array of starting positions
  const start = Object.keys(map).filter((node) => {
    return node.endsWith("A");
  });

  return {
    instructions,
    map,
    start,
  };
}

/**
 * this function generator will endlessly provide the next instruction
 * looping back to the beginning when it reaches the end
 */
function* nextInstruction(i: number, instructions: Instrunction[]) {
  const total = instructions.length;
  yield instructions[i];

  while (true) {
    if (i === total - 1) {
      i = 0;
    } else {
      i += 1;
    }
    yield instructions[i];
  }
}

/**
 * Helpers to stop endless loop
 */
const startTime = Date.now();
function checkTimeLimit() {
  const currentTime = Date.now();
  const limit = 2000;
  if (currentTime - startTime > limit) {
    throw new Error(
      `process took longer than ${limit / 1000} seconds, aborting`,
    );
  }
}

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}
function lcm(numbers: number[]): number {
  return numbers.reduce((acc, n) => {
    return (acc * n) / gcd(acc, n);
  }, 1);
}

export function part2(str: string): number {
  const { instructions, map, start } = setup(str);

  /**
   * For each starting point individually, find how many
   * steps it takes to get to the final spot
   */
  const moves: number[] = start.map((node) => {
    let stepCount = 0;
    const getInstruction = nextInstruction(0, instructions);
    while (true) {
      const instruction = getInstruction.next().value!;
      stepCount += 1;
      const nextNode = map[node][instruction];
      if (nextNode.endsWith("Z")) {
        return stepCount;
      }
      node = nextNode;
    }
  });

  // find least common multiple of all the moves
  return lcm(moves);
}

if (!Deno.env.get("TESTING")) {
  try {
    console.log(part2(input));
  } catch (e) {
    console.error(`%c${e.message}`, "color: red");
  }
}
