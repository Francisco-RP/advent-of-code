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

export function part1(str: string): number {
  const left: number[] = [];
  const right: number[] = [];
  str
    .trim()
    .split(`\n`)
    .forEach((line) => {
      const [l, r] = line.trim().split(/\s+/);
      left.push(parseFloat(l));
      right.push(parseFloat(r));
    });
  left.sort();
  right.sort();
  let result = 0;
  for (let i = 0; i < left.length; i++) {
    result += Math.abs(left[i] - right[i]);
  }
  return result;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
