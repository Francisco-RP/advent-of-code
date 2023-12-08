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

function getNextNode(inst: Instrunction, current: [string, string]): string {
  return inst === "L" ? current[0] : current[1];
}

export function part1(str: string): number {
  const { instructions, map } = setup(str);

  let i = 0;
  let instruction: Instrunction;
  let node = "AAA";
  let stepCount = 0;
  while (true) {
    instruction = instructions[i];
    i += 1;
    if (i >= instructions.length) {
      i = 0;
    }
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
