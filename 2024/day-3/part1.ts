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

function calc(acc: number, mul: string): number {
  const [left, right] = mul.replace("mul(", "").replace(")", "").split(",").map(
    Number,
  );
  acc += left * right;
  return acc;
}

export function part1(str: string): number {
  const re = /mul\(\d+,\d+\)/g;
  const result = str.trim().match(re)?.reduce(calc, 0);
  return result || 0;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
