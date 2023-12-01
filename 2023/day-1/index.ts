const input = await Deno.readTextFile("./input.txt");

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
const group = `(${Object.keys(nums).join("|")})`;
const textRE = new RegExp(group, "g");
const numRE = new RegExp("[0-9]", "g");

function handleLine(line: string): number {
  let startingN = 0;
  let endingN = 0;
  const textMatches = line.match(textRE);
  const numMatches = line.match(numRE);

  if (textMatches && numMatches) {
    // two1nine: ["two", "nine"] ["1"]
    // 4nineeightseven2 [ "nine", "eight", "seven" ] [ "4", "2" ]
    // 7pqrstsixteen ["six"] ["7"]
    const firstText = textMatches[0];
    const firstNum = numMatches[0];
    if (line.indexOf(firstText) < line.indexOf(firstNum)) {
      startingN = nums[firstText];
    } else {
      startingN = parseInt(firstNum, 10);
    }

    const lastText = textMatches.at(-1)!;
    const lastNum = numMatches.at(-1)!;
    if (line.lastIndexOf(lastText) > line.lastIndexOf(lastNum)) {
      endingN = nums[lastText];
    } else {
      endingN = parseInt(lastNum, 10);
    }
  } else if (!textMatches && numMatches) {
    startingN = parseInt(numMatches[0], 10);
    endingN = parseInt(numMatches.at(-1)!, 10);
  } else if (textMatches && !numMatches) {
    startingN = nums[textMatches[0]];
    endingN = nums[textMatches.at(-1)!];
  }

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
