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

type Instrunction = "R" | "L";

interface Mappings {
  [key: string]: [string, string];
}

function setup(str: string): { instructions: Instrunction[]; map: Mappings } {
  const lines = str.trim().split(`\n`);
  // first line is instructions
  const instructions = lines.shift()?.trim().split("") as Instrunction[] || [];
  // 2nd line is blank
  lines.shift();

  // the rest are the mappings
  const map: Mappings = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [node, left, right] = line.match(/[A-Z]{3}/g) || [];
    if (node && left && right) {
      map[node] = [left, right];
    }
  }

  return {
    instructions,
    map,
  };
}

/**
 * this function generator will endlessly provide the next instruction
 * looping back to the beginning when it reaches the end
 */
function* nextInstruction(i: number, instructions: Instrunction[]) {
  const total = instructions.length;
  yield instructions[i]; // first time will just return i which is 0

  // every subsequent call to next().value will yield updated i
  while (true) {
    if (i === total - 1) {
      i = 0;
    } else {
      i += 1;
    }
    yield instructions[i];
  }
}

function getNextNode(inst: Instrunction, current: [string, string]): string {
  return inst === "L" ? current[0] : current[1];
}

export function part1(str: string): number {
  const { instructions, map } = setup(str);

  const getInstruction = nextInstruction(0, instructions);

  let node = "AAA";
  let stepCount = 0;
  while (true) {
    const instruction = getInstruction.next().value!;
    stepCount += 1;
    const nextNode = getNextNode(instruction, map[node]);
    if (nextNode === "ZZZ") break;
    node = nextNode;
  }

  return stepCount;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
