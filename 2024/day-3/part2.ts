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

function calc(mul: string): number {
  const [left, right] = mul.replace("mul(", "").replace(")", "").split(",").map(
    Number,
  );
  return left * right;
}

export function part2(str: string): number {
  const re = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;

  const stack = str.trim().match(re) || [];

  let mul = true;
  let result = 0;
  for (let i = 0; i < stack.length; i++) {
    const action = stack[i];
    if (action === "do()") {
      mul = true;
    } else if (action === "don't()") {
      mul = false;
    } else if (mul) {
      result += calc(action);
    }
  }
  return result;
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
