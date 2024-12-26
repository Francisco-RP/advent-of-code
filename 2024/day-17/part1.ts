/****************************************
 * Part 1
 */

class CPU {
  pointer = 0;
  output: number[] = [];

  constructor(
    public regA: number,
    public regB: number,
    public regC: number,
    public pogram: number[]
  ) {}
  // eight instructions
  run() {
    while (this.pointer < this.pogram.length) {
      const opcode = this.pogram[this.pointer];
      const operand = this.pogram[this.pointer + 1];
      const result = this.op(opcode, operand);
      // @ts-ignore
      if (result !== "jumped") {
        this.pointer += 2;
      }
    }
  }

  getCombo(operand: number) {
    if (operand >= 0 && operand <= 3) return operand;
    if (operand === 4) return this.regA;
    if (operand === 5) return this.regB;
    if (operand === 6) return this.regC;
    return operand;
  }

  op(opcode: number, operand: number) {
    const ops = [this.adv, this.bxl, this.bst, this.jnz, this.bxc, this.out, this.bdv, this.cdv];
    return ops[opcode].call(this, operand);
  }

  adv(operand: number) {
    this.regA = Math.floor(this.regA / 2 ** this.getCombo(operand));
  }
  bxl(operand: number) {
    this.regB = this.regB ^ operand;
  }
  bst(operand: number) {
    this.regB = this.getCombo(operand) % 8;
  }
  jnz(operand: number) {
    if (this.regA === 0) return;
    this.pointer = operand;
    return "jumped";
  }
  bxc(operand: number) {
    this.regB = this.regB ^ this.regC;
  }

  out(operand: number) {
    this.output.push(this.getCombo(operand) % 8);
  }
  bdv(operand: number) {
    this.regB = Math.floor(this.regA / 2 ** this.getCombo(operand));
  }
  cdv(operand: number) {
    this.regC = Math.floor(this.regA / 2 ** this.getCombo(operand));
  }
}

function parseInput(str: string) {
  const [regA, regB, regC, program] = str
    .trim()
    .split(`\n`)
    .filter((x) => !!x)
    .map((x) => x.replace(/[^\d,]/g, ""));
  const p = program.split(",").map(Number);
  return new CPU(parseInt(regA, 10), parseInt(regB, 10), parseInt(regC, 10), p);
}

export async function part1(str: string): Promise<string> {
  const computer = parseInput(str);
  computer.run();
  return computer.output.join(",");
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
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

if (!Deno.env.get("TESTING")) {
  // running from the command line or vscode's debugger
  console.log(await part1(input));
}
