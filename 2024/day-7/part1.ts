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

/*
Idea 1:
n-ary tree search

In part 1 we only have 2 operators: + and *
so this will look like a binary tree search

example: 292: 11 6 16 20
operators: + and *
                          operators.length= 2 to the power of the index position
           11                2 ** 0 = 1
        +       *
      6            6         2 ** 1 = 2
    +  *         +   *
  16    16     16     16     2 ** 2 = 4
 + *    + *    + *    + *
20 20  20 20  20 20  20 20   2 ** 3 = 8

DFS? or BFS


*/

function calc(a: number, b: number, op: string): number {
  if (op === "+") return a + b;
  if (op === "*") return a * b;
  if (op === "||") return parseInt(`${a}${b}`, 10);
  return 0;
}

function solve(arr: number[], ops: string[], total: number): boolean {
  // BFS
  // for each i in the arr, we will be creating a new stack
  // the stack size will grow exponentially at: ops.length ** i
  let stack: number[] = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    const rightSide = arr[i];
    const newStack: number[] = [];
    for (const leftSide of stack) {
      // for each operator we calculate stack[x] op arr[i]
      for (const op of ops) {
        const val = calc(leftSide, rightSide, op);
        newStack.push(val);
      }
    }
    stack = newStack;
  }

  return stack.includes(total);
}

export function processLine(str: string, ops: string[]): number {
  const [valueStr, numberStr] = str.split(":").map((s) => s.trim());
  const value = parseInt(valueStr, 10);
  const numbers = numberStr.split(" ").map(Number);
  const result = solve(numbers, ops, value);
  if (result) return value;
  return 0;
}

export function part1(str: string): number {
  const equations = str.trim().split(`\n`);
  let result = 0;
  for (const eq of equations) {
    result += processLine(eq, ["+", "*"]);
  }
  return result;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
