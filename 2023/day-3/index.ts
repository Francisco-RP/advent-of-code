import { eachSurrounding } from "../../lib/arrays.ts";
const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  input = `
.........*..................89..877*....#..572..........22............891..........295.354*864...875............=..&..706.........-.........
.......307............59............510...*....187.*247............+........#..741*..............$.......$608.316.355......*.....916....858.
..................745......705*590.......815..@...........296.....540...=..742........843.*44.......718.................309.............*...
`.trim();
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/***********************************************************************
 * Part 1
 */

export function part1(str: string): number {
  const numRe = new RegExp("\\d+", "g");
  const lines = str.split(`\n`);
  let sum = 0;

  for (let y = 0; y < lines.length; y++) {
    const row = lines[y];

    let match;

    // find all numbers in the string
    while ((match = numRe.exec(row)) !== null) {
      const symbolRE = new RegExp("[^\\d.\\n]");
      const x = match.index;
      const len = match[0].length;

      if (lines[y - 1]) {
        // check if line above has symbol
        const sub = lines[y - 1].substring(x - 1, x + len + 1);
        if (symbolRE.test(sub)) {
          sum += parseInt(match[0], 10);
          continue;
        }
      }

      // check if the characters before and after on current line have a symbol
      const sub2 = row.substring(x - 1, x + len + 1);
      if (symbolRE.test(sub2)) {
        sum += parseInt(match[0], 10);
        continue;
      }

      if (lines[y + 1]) {
        // check if line below has a symbol
        const sub3 = lines[y + 1].substring(x - 1, x + len + 1);
        if (symbolRE.test(sub3)) {
          sum += parseInt(match[0], 10);
          continue;
        }
      }
    }
  }

  return sum;
}

/***********************************************************************
 * Part 2
 */

const gearRE = new RegExp("\\*", "g");

function expand(x: number, row: string[]): number {
  let str = row[x];
  let left = x - 1;
  let right = x + 1;
  const re = new RegExp("\\d");
  while ((row[left] && re.test(row[left]))) {
    str = row[left] + str;
    left -= 1;
  }
  while ((row[right] && re.test(row[right]))) {
    str += row[right];
    right += 1;
  }
  return parseInt(str, 10);
}

export function part2(str: string): number {
  const matrix = str.split(`\n`).map((line) => line.split(""));
  let sum = 0;

  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];

    for (let x = 0; x < row.length; x++) {
      if (row[x] !== "*") continue;
      const nums: number[] = [];

      eachSurrounding(x, y, matrix, (_x, _y, _char) => {
        if (/\d/.test(_char)) {
          const n = expand(_x, matrix[_y]);
          if (!nums.includes(n)) nums.push(n);
        }
      });

      console.log(nums);
      if (nums.length === 2) {
        sum += nums[0] * nums[1];
      }
    }
  }

  return sum;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
  console.log(part2(input));
}
