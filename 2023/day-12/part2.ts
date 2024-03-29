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
  return 0;
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
