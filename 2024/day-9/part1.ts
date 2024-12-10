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

/*
 The digits alternate between indicating the length of a file and the length of free space.

 example: 12345
 1 block file with 2 blocks of free space
 3 block file with 4 blocks of free space
 5 block file

 Each file on disk also has an ID number based on the order of the files as they appear
 before they are rearranged, starting with ID 0

 example: 12345
 has 3 files: 1, 3, and 5
         ids: 0, 1,     2

 diskmap for 12345 is:  0..111....22222
 id 0: 1 block file with 2 blocks of free space: 0..
 id 1: 1 block file with 2 blocks of free space: 111....
 id 2: 5 block file with no free space: 22222

 0  1  2  3  4  5  6  7  8  9
 23 33 13 31 21 41 41 31 40 2
 00...111...2...333.44.5555.6666.777.888899
 00...111...2...333.44.5555.6666.777.888899

 0099811188827773336446555566..............
 0099811188827773336446555566..............
*/

function expand(nums: number[]): Array<string | number> {
  let id = 0;
  let blockIndex = 0;
  let freeIndex = 1;
  const diskmap: Array<string | number> = [];
  while (blockIndex < nums.length) {
    const block = nums[blockIndex];
    const free = nums[freeIndex];

    diskmap.push(...Array(block).fill(id));
    if (free > 0) {
      diskmap.push(...Array(free).fill("."));
    }
    id += 1;
    blockIndex += 2;
    freeIndex += 2;
  }
  return diskmap;
}

function defrag(diskmap: Array<string | number>): Array<string | number> {
  const result = diskmap.concat([]); // clone
  for (let i = diskmap.length - 1; i >= 0; i--) {
    const block = diskmap[i];
    if (block === ".") continue;
    const firstEmpty = result.indexOf(".");
    if (firstEmpty >= i) break;
    result.splice(firstEmpty, 1, block);
    result.splice(i, 1, ".");
  }
  return result;
}

function checksum(nums: Array<string | number>): number {
  return nums.reduce((sum: number, n, i) => {
    if (typeof n === "number") {
      sum += n * i;
    }
    return sum;
  }, 0);
}

export function part1(str: string): number {
  const nums = str.trim().replace(/[^\d]/g, "").split("").map(Number);
  // console.log(nums);
  const diskmap = expand(nums);
  // console.log(diskmap.join(""));
  const defragged = defrag(diskmap);
  // console.log(defragged.join(""));
  return checksum(defragged);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
