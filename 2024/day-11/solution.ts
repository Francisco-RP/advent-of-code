const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "125 17";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 1
 */

/**
 * Remove leading zeros by double type coercion.
 * Converting it to a Number will auto strip leading zeros
 * then converting it back to a string
 */
function trim(stone: string): string {
  return String(Number(stone));
}

/*
125                             | 17
253000                          | 1                      7
253                   |0        | 2024                   14168
512072                |1        | 20         24          28676032
512       |72         |2024     | 2     0    2     4     2867    6032
1036288   |7     |2   |20  |24  | 4048  1    4048  8096  28  67  60  32
2097446912|14168 |4048|2|0 |2|4 | 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2
*/

/**
 * Cache the number of stones each stone will
 * get split into at a certain blink iteration
 */
const cache: Record<string, number[]> = {};

const sum = (arr: number[]): number => arr.reduce((total, n) => (total += n), 0);

function getStoneCount(stone: string, blinks: number): number {
  if (blinks === 0) return 1;
  if (cache[stone]?.[blinks]) {
    return cache[stone]?.[blinks];
  }
  let result: number = 0;
  if (stone === "0") {
    result = getStoneCount("1", blinks - 1);
  } else if (stone.length % 2 === 0) {
    const left = stone.substring(0, stone.length / 2);
    const right = trim(stone.substring(stone.length / 2));
    result = getStoneCount(left, blinks - 1) + getStoneCount(right, blinks - 1);
  } else {
    result = getStoneCount(String(Number(stone) * 2024), blinks - 1);
  }
  if (!cache[stone]) cache[stone] = [];
  cache[stone][blinks] = result;
  return result;
}

/**
 *
 * @param str The input string
 * @param blinks the number of blinks to process
 * @returns the new number of stones after processing all of the blinks
 */
export function solve(str: string, blinks: number): number {
  const stones = str.trim().split(" ");
  const results = sum(stones.map((s) => getStoneCount(s, blinks)));
  return results;
}

if (!Deno.env.get("TESTING")) {
  console.log(solve(input, 6));
}
