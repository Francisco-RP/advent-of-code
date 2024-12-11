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

function rmLead(stone: string): string {
  if (/^0+$/.test(stone)) return "0";
  return stone.replace(/^0+/, "");
}

function rules(stone: string): string[] {
  // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
  if (stone === "0") return ["1"];

  // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
  // The left half of the digits are engraved on the new left stone,
  // and the right half of the digits are engraved on the new right stone.
  // (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
  if (stone.length % 2 === 0) {
    const left = stone.substring(0, stone.length / 2);
    const right = stone.substring(stone.length / 2);
    return [rmLead(left), rmLead(right)];
  }

  // If none of the other rules apply, the stone is replaced by a new stone;
  // the old stone's number multiplied by 2024 is engraved on the new stone.
  return [String(Number(stone) * 2024)];
}

export function part1(str: string, blinks: number): number {
  let stones = str.trim().split(" ");
  let nextStones: string[] = [];
  for (let i = 0; i < blinks; i++) {
    nextStones = [];
    for (const stone of stones) {
      nextStones.push(...rules(stone));
    }
    stones = [...nextStones];
    nextStones = [];
  }
  return stones.length;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input, 25));
}
