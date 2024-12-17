import { sum } from "../../lib/arrays.ts";
import { lcm } from "../../lib/math.ts";
/****************************************
 * Part 1
 */

// these machines have two buttons labeled A and B. Worse, you can't just put in a token and play;
// it costs 3 tokens to push the A button
// and 1 token to push the B button.

class Button {
  x: number = 0;
  y: number = 0;
  constructor(str: string, public tokens: number) {
    // Button A: X+94, Y+34
    const [, XStr, YStr] = str.match(/X\+(\d+), Y\+(\d+)/) || [];
    this.x = parseInt(XStr, 10);
    this.y = parseInt(YStr, 10);
  }
}

class Machine {
  buttonA: Button;
  buttonB: Button;
  prize: { x: number; y: number };
  constructor(str: string) {
    // "Button A: X+94, Y+34\nButton B: X+22, Y+67\nPrize: X=8400, Y=5400"
    const [a, b, prize] = str.split("\n");
    this.buttonA = new Button(a, 3);
    this.buttonB = new Button(b, 1);
    const [, prizeXStr, prizeYStr] = prize.match(/X=(\d+), Y=(\d+)/) || [];
    this.prize = {
      x: parseInt(prizeXStr, 10),
      y: parseInt(prizeYStr, 10),
    };
  }

  win(x: number, y: number): boolean {
    return x === this.prize.x && y === this.prize.y;
  }
}

/*
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

X
A: 8400 / 94 = 89 times, remainder 34
B: 8400 / 22 = 381 times, remainder 18
button A can be pressed a max of 89 times
button B can be pressed a max of 381 times

Y
5400 / 34 = 158 times
5400 / 67 = 80 times
button A can be pressed a max of 158 times
button B can be pressed a max of 80 times

*/
function getMax(machine: Machine) {
  const aX = Math.floor(machine.prize.x / machine.buttonA.x);
  const aY = Math.floor(machine.prize.y / machine.buttonA.y);

  const bX = Math.floor(machine.prize.x / machine.buttonB.x);
  const bY = Math.floor(machine.prize.y / machine.buttonB.y);

  return [Math.min(aX, aY), Math.min(bX, bY)];
}

function solve(machine: Machine): number {
  // example: "Button A: X+94, Y+34  Button B: X+22, Y+67  Prize: X=8400, Y=5400"
  // solution:
  // A button 80 times, x=7520 y=2720
  // B button 40 times, x=880 y=2680

  // button A can only be pressed a max of 89 times before it passes the prize
  // button B can only be pressed a max of 80 times before it passes the prize
  // our goal is to press button B more than button A because it's cheaper
  const [maxA, maxB] = getMax(machine);

  // we want to you ButtonB as much as we can because its cheaper
  //
  let b = maxB;
  let a = 0;
  while (b >= 0) {
    const bX = b * machine.buttonB.x;
    const bY = b * machine.buttonB.y;
    while (a <= maxA) {
      const aX = a * machine.buttonA.x;
      const aY = a * machine.buttonA.y;
      if (machine.win(aX + bX, aY + bY)) {
        return machine.buttonA.tokens * a + machine.buttonB.tokens * b;
      } else if (aX + bX > machine.prize.x || aY + bY > machine.prize.y) {
        a = 0;
        break;
      } else {
        a += 1;
      }
    }

    b -= 1;
  }

  return 0;
}

export async function part1(str: string): Promise<number> {
  const machines = str
    .trim()
    .split(`\n\n`)
    .map((x) => new Machine(x))
    .map((m) => solve(m));
  return sum(machines);
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
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279  
`;
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

if (!Deno.env.get("TESTING")) {
  // running from the command line or vscode's debugger
  console.log(await part1(input));
}
