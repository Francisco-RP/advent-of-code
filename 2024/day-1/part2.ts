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

export function part2(str: string): number {
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

  let result = 0;

  const map = new Map<number, number>();
  const obj = right.reduce((acc, num) => {
    const count = acc.get(num);
    acc.set(num, (count ?? 0) + 1);
    return acc;
  }, map);

  for (let i = 0; i < left.length; i++) {
    result += left[i] * (obj.get(left[i]) ?? 0);
  }

  return result;
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
