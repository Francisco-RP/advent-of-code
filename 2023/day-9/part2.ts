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

function setup(str: string) {
  return str.trim().split("\n").map((line) => {
    return line.trim().split(" ").map(Number);
  });
}

function predictNext(history: number[]): number {
  const stack = [];
  let left = 0;
  let right = 1;
  let input = history;
  let nextInput = [];
  while (!input.every((n) => n === 0)) {
    const diff = input[right] - input[left];
    nextInput.push(diff);
    left++;
    right++;
    if (right >= input.length) {
      stack.push(input);
      input = nextInput;
      nextInput = [];
      left = 0;
      right = 1;
    }
  }
  const num = stack.reverse().reduce((acc, history) => {
    return (acc - history[0]) * -1;
  }, 0);
  return num;
}

export function part2(str: string): number {
  const histories = setup(str);
  return histories.reduce((acc, history) => {
    return acc + predictNext(history);
  }, 0);
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
