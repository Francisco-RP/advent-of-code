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
  [key: string]: [string, string];
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
      map[node] = [left, right];
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

function getNextNode(inst: Instrunction, current: [string, string]): string {
  return inst === "L" ? current[0] : current[1];
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

export function part2(str: string): number {
  const { instructions, map, start } = setup(str);

  let stepCount = 0;

  // instead of one node, we have many to look at simultaneously
  let nodes = start;

  const getInstruction = nextInstruction(0, instructions);

  while (true) {
    const instruction = getInstruction.next().value!;
    stepCount += 1;

    const nextNodes: string[] = [];
    let endsWithZCount = 0;
    for (const node of nodes) {
      const next = getNextNode(instruction, map[node]);
      if (next.endsWith("Z")) endsWithZCount += 1;
      nextNodes.push(next);
    }
    console.log(nodes);
    if (endsWithZCount === nextNodes.length) break;
    nodes = nextNodes;

    checkTimeLimit(); // throws and exits if takes too long
  }
  return stepCount;
}

if (!Deno.env.get("TESTING")) {
  try {
    console.log(part2(input));
  } catch (e) {
    console.error(`%c${e.message}`, "color: red");
  }
}
