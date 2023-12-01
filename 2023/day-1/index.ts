const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = await Deno.readTextFile(__dirname + "/input.txt");
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/***********************************************************************
 * Part 1
 */

/*
The newly-improved calibration document consists of lines of text; each line originally contained a
specific calibration value that the Elves now need to recover. On each line, the calibration value
can be found by combining the first digit and the last digit (in that order) to form a single
two-digit number.
*/

export function part1(str: string): number {
  return str
    .trim()
    .split(`\n`)
    .map((s) => {
      const arr = s.replaceAll(/[^\d]/g, "").split("");
      return parseInt(`${arr[0]}${arr.at(-1)}`);
    })
    .reduce((sum, n) => sum + n, 0);
}

/***********************************************************************
 * Part 2
 */

/*
Your calculation isn't quite right. It looks like some of the digits are actually spelled out with
letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".
*/

const nums: { [key: string]: number } = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
};
const numRE = new RegExp("[0-9]", "g");

function getTextPositions(str: string): [number, number] {
  let firstText = "";
  let firstIndex = 9999;
  let lastText = "";
  let lastIndex = -1;
  Object.keys(nums).forEach((key) => {
    const i = str.indexOf(key);
    if (i >= 0 && (!firstText || i < firstIndex)) {
      firstText = key;
      firstIndex = i;
    }
    const j = str.lastIndexOf(key);
    if (j >= 0 && (!lastText || j > lastIndex)) {
      lastText = key;
      lastIndex = j;
    }
  });

  let startN = nums[firstText];
  let endN = nums[lastText];

  const numMatches = str.match(numRE);
  if (numMatches) {
    const first = numMatches[0];
    const i = str.indexOf(first);
    const last = numMatches.at(-1);
    const j = str.lastIndexOf(last!);
    if (i < firstIndex) startN = parseInt(first, 10);
    if (j > lastIndex) endN = parseInt(last!, 10);
  }

  return [startN, endN];
}

function handleLine(line: string): number {
  line = line.trim();
  const [startingN, endingN] = getTextPositions(line);
  return parseInt(`${startingN}${endingN}`);
}

export function part2(str: string): number {
  return str
    .trim()
    .split(`\n`)
    .map(handleLine)
    .reduce((sum, n) => sum + n, 0);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
  console.log(part2(input));
}
