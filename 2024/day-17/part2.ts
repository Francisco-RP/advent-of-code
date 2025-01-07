/****************************************
 * Part 2
 */

class CPU {
  pointer = 0;
  output: number[] = [];
  logEnabled = false;

  constructor(
    public regA: number,
    public regB: number,
    public regC: number,
    public program: number[]
  ) {
    this.log();
  }

  toBin(n: number, pad: number = 0): string {
    const bin = (n >>> 0).toString(2).padStart(pad, "0");
    return bin.replace(/(.{3})/g, "$1 ").trim();
  }

  log(opcode?: number, operand?: number) {
    if (!this.logEnabled) return;
    const octal = this.regA.toString(8);
    const bitLength = octal.length * 3;

    if (typeof opcode === "number") {
      console.log("op", opcode, "- operand", operand);
    }

    console.table({
      RegA: {
        decimal: this.regA,
        binary: this.toBin(this.regA, bitLength),
        octal,
      },
      RegB: {
        decimal: this.regB,
        binary: this.toBin(this.regB, bitLength),
        octal: this.regB.toString(8),
      },
      RegC: {
        decimal: this.regC,
        binary: this.toBin(this.regC, bitLength),
        octal: this.regC.toString(8),
      },
    });

    console.log("output:", this.output.join(","));
    console.log("");
  }

  run() {
    while (this.pointer < this.program.length) {
      const opcode = this.program[this.pointer];
      const operand = this.program[this.pointer + 1];
      this.op(opcode, operand);
      this.log(opcode, operand);
    }
  }

  getCombo(operand: number) {
    if (operand >= 0 && operand <= 3) return operand;
    if (operand === 4) return this.regA;
    if (operand === 5) return this.regB;
    if (operand === 6) return this.regC;
    return operand;
  }

  op(opcode: number, operand: number): void {
    switch (opcode) {
      case 0: // adv
        // this seems to be a bitwise shift right by the operand
        // for example:
        // regA = 2024 in binary is 011 111 101 000  (which is 3750 in Octal)
        // if the operand is 3, then we end up shifting the binary over by 3 bits
        // regA becomes: 011 111 101 000 >> 3 = 000 011 111 101 = 253  (which is 375 in Octal)
        this.regA = Math.floor(this.regA / 2 ** this.getCombo(operand));
        // is the same as:
        // this.regA = this.regA >> this.getCombo(operand)
        this.pointer += 2;
        break;
      case 1: // bxl
        // bitwise xor
        // if regB is: 6, and the operand is 2
        //   6 = 110
        //   2 = 010
        // XOR = 100 = 4
        this.regB = this.regB ^ operand;
        this.pointer += 2;
        break;
      case 2: // bst
        // mod 8 seems to return the last 3 binary bits of the left hand side
        // example: 2200021 = 001 000 011 001 000 111 010 101
        //          2200021 % 8 = 5 (that last 101 in the binary)
        this.regB = this.getCombo(operand) % 8;
        this.pointer += 2;
        break;
      case 3: // jnz
        if (this.regA !== 0) {
          this.pointer = operand;
        } else {
          this.pointer += 2;
        }
        break;
      case 4: // bxc
        // bitwise XOR of regB and regC
        // RegB: 4       = 000 000 000 000 000 000 000 100
        // RegC: 2200021 = 001 000 011 001 000 111 010 101
        // XOR           = 001 000 011 001 000 111 010 001
        // = 2200017
        this.regB = this.regB ^ this.regC;
        this.pointer += 2;
        break;
      case 5: // out
        // mod 8 returns the last three bits of a number, or the last number of an octal
        // 253 mod 8 = 5
        // 253 in binary is:     011 111 101
        // 253 in octal is: 375 = 3   7   5
        // mod 8 seems to always just return the value of the last 3 bits of any number
        this.output.push(this.getCombo(operand) % 8);
        this.pointer += 2;
        break;
      case 6: // bdv
        // set regB to RegA shifted bitwise right by the operand
        this.regB = Math.floor(this.regA / 2 ** this.getCombo(operand));
        // OR this.regB = this.regA >> this.getCombo(operand)
        this.pointer += 2;
        break;
      case 7: // cdv
        // set regC to RegA shifted bitwise right by the operand
        // example: operand = 5
        // RegA: 35200350 =  010 000 110 010 001 110 101 011 110
        // RegB: 4
        // combo 5 returns regB
        // So this is the equivalent of: 35200350 >> 4 = 2200021
        // shifted right by 4 digits becomes: 001 000 011 001 000 111 010 101
        this.regC = Math.floor(this.regA / 2 ** this.getCombo(operand));
        // OR this.regC = this.regA >> this.getCombo(operand)
        this.pointer += 2;
        break;
    }
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

/*
program: 0,3,5,4,3,0
output: 0,3,5,4,3,0

0,3 = shift RegA right by 3 bits
5,4 = out A % 8, output the last 3 bits of RegA as decimal
3,0 = if A !== 0, jump back to 0 

knowing that above, I can assume that RegA looks like this and I need to find the last right last 3 bits
Starting Register A = 000 011 100 101 011 000 ???

It can be any number between: 000 011 100 101 011 000 111 and 000 011 100 101 011 000 000 (inclusive)
A in decimal = 117447 through 117440 
A in octal = 345307 through 345300

The expected answer for Register is: 117440
dec: 117440 
oct: 345300
011 100 101 011 000 000
  3  4   5    3  0    0


RegA = 35200350
program: 2,4, 1,2, 7,5, 4,7, 1,3, 5,5, 0,3, 3,0

000 011 011 000 101 101 011 001 111 100 101 111 010 001 100 010

2,4 = bst = this.regB = this.getCombo(operand) % 8;
  set RegB to the last 3 bits of RegA
  RegA = 10000110010001110101011110 = 35200350
  RegB = 00000000000000000000000110 = 6
  RegC = 00000000000000000000000000 = 0

1,2 = set RegB to XOR of operand: RegB ^ 2 = 6 ^ 2 = 4
  RegA = 10000110010001110101011110 = 35200350
  RegB = 00000000000000000000000100 = 4
  RegC = 00000000000000000000000000 = 0

7,5 = set RegC to RegA shifted right by RegB (4 bits)
  RegA = 1000011001000111010101 1110 = 35200350
  RegB = 0000000000000000000000 0100 = 4
  RegC = 0000 1000011001000111010101 = 2200021

4,7 =  this.regB = this.regB ^ this.regC;
  RegB:  00000000000000000000000100 = 4
  RegC:  00001000011001000111010101 = 2200021
  --------------------------------------- xor
  RegB = 00001000011001000111010001 = 2200017

  RegA = 10000110010001110101011110 = 35200350
  RegB = 00001000011001000111010001 = 2200017
  RegC:  00001000011001000111010101 = 2200021

1,3 = this.regB = this.regB ^ operand;
  RegB:  00001000011001000111010001 = 2200017
         00000000000000000000000011 = 3
  --------------------------------------- xor
  RegB = 00001000011001000111010010 = 2200018

  RegA = 10000110010001110101011110 = 35200350
  RegB = 00001000011001000111010010 = 2200018
  RegC:  00001000011001000111010101 = 2200021

5,5 = push last 3 bits of RegB to output
  RegB = 00001000011001000111010 010 = 2200018
  out =  2

0,3 = RegA = RegA shifted right by 3 bits
  RegA: 10000110010001110101011 110 = 35200350
  RegA= 000 10000110010001110101011 = 4400043

3,0 = jump to 0

RegA: 4400043
RegB: 2200018
RegC: 2200021
out: 2

RegA gets shifted right by 3 bits n-1 times

? RegA is shifted by 3
get last 3 bits of RegB = 000
RegB XOR by 3 = RegB ends in 011
RegB XOR by RegC = 011 ^ 000
RegC = RegA >> RegB = RegA ended in 000
RegB XOR by 2 = 001 ^ 010 = 011
RegB is last 3 bits of RegA = ends in 001

*/

function octalToDecimal(octalString: string) {
  let decimal = 0;
  let power = 0;

  for (let i = octalString.length - 1; i >= 0; i--) {
    const digit = parseInt(octalString[i], 8);

    if (digit < 0 || digit > 7) {
      throw new Error("Invalid octal number");
    }

    decimal += digit * Math.pow(8, power);
    power++;
  }

  return decimal;
}

function findRegAForExample(computer: CPU): number {
  const octalBase = computer.program.reduce((o, n) => n.toString(8) + o, "");
  const program = computer.program.join(",");

  let num = octalToDecimal(octalBase + 0);

  for (let i = 0; i < 8; i++) {
    num += i;
    computer.regA = num;
    // computer.log();
    computer.run();
    if (program === computer.output.join(",")) {
      return num;
    }
  }

  return 0;
}

function findRegAForInput(computer: CPU) {
  const programLength = computer.program.length;
  // 8**16 = 281_474_976_710_656
  computer.run();
  return 0;
}

export async function part2(str: string): Promise<number> {
  const computer = parseInput(str);
  const result = findRegAForInput(computer);
  return result;
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
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

if (!Deno.env.get("TESTING")) {
  // running from the command line or vscode's debugger
  console.log(await part2(input));
}
