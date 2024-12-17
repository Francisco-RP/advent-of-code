import { sum } from "../../lib/arrays.ts";
/****************************************
 * Part 2
 * adapted from https://github.com/JoanaBLate/advent-of-code-js/blob/main/2024/day13-solve2.js
 */

// 10 trillion
const OFFSET = 10_000_000_000_000;

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

function solve(machine: Machine): number {
  const prizeX = OFFSET + machine.prize.x;
  const prizeY = OFFSET + machine.prize.y;
  const buttonAx = machine.buttonA.x;
  const buttonAy = machine.buttonA.y;
  const buttonBx = machine.buttonB.x;
  const buttonBy = machine.buttonB.y;

  const aClicksXMultiplier = buttonAx * buttonBy;
  const aClicksYMultiplier = -(buttonAy * buttonBx);
  const prizeXMultiplied = prizeX * buttonBy;
  const prizeYMultiplied = -(prizeY * buttonBx);

  const aClicksMultiplierCombined = aClicksXMultiplier + aClicksYMultiplier;
  const prizeMultipliedCombined = prizeXMultiplied + prizeYMultiplied;

  const aClicks = prizeMultipliedCombined / aClicksMultiplierCombined;

  if (prizeMultipliedCombined % aClicksMultiplierCombined !== 0) {
    return 0;
  } // has no solution

  const bClicks = (prizeX - buttonAx * aClicks) / buttonBx;

  if (bClicks !== Math.floor(bClicks)) {
    return 0;
  } // has no solution

  return aClicks * machine.buttonA.tokens + bClicks;
}

export async function part2(str: string): Promise<number> {
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
  console.log(await part2(input));
}
