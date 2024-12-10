const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "354631466260";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 2
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

function findEmpty(
  diskmap: Array<string | number>,
  spacesNeeded: number,
  i: number,
): number {
  let empty = "";
  let j = diskmap.indexOf(".");
  for (; j < i; j++) {
    const curr = diskmap[j];
    if (typeof curr === "string") {
      if (empty.length < spacesNeeded) {
        empty += curr;
      } else {
        // we have enough empty spaces!
        return j - spacesNeeded;
      }
    } else {
      if (empty.length >= spacesNeeded) {
        return j - spacesNeeded;
      }
      empty = "";
    }
  }
  if (empty.length >= spacesNeeded) {
    return j - spacesNeeded;
  }
  return -1;
}

// start:     00...111...2...333.44.5555.6666.777.888899
// expected:  00992111777.44.333....5555.6666.....8888..
// so far:    00992111777.44.333....5555.6666.....8888..
function defrag(diskmap: Array<string | number>): Array<string | number> {
  const result = diskmap.concat([]);
  let currentBlock: Array<string | number> = [];

  // go through the array backwards
  //  build a block
  //    when block is complete and is numbers, look for empty space to swap to
  //      starting from the first empty space and looking forward until we either encounter a
  //      group of empty adjacent spaces that could fit the block or we reach the same index
  //      from the outer loop that's going backwards

  for (let i = diskmap.length - 1; i >= 0; i--) {
    const block = diskmap[i];
    if (!currentBlock.length || currentBlock[0] === block) {
      currentBlock.push(block);
      continue;
    }

    // we've encountered a change so now need to check if currentBlock is [...]
    if (typeof currentBlock[0] === "string") {
      currentBlock = [block];
      continue;
    }

    const start = findEmpty(result, currentBlock.length, i + 1);
    if (start > -1) {
      // @ts-ignore shut up typescript I know what I'm doing, most of the time
      result.splice(start, currentBlock.length, ...currentBlock);
      result.splice(
        i + 1,
        currentBlock.length,
        ...Array(currentBlock.length).fill("."),
      );
    }

    currentBlock = [block];
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

export function part2(str: string): number {
  // console.log(str);
  const nums = str.trim().replace(/[^\d]/g, "").split("").map(Number);
  const diskmap = expand(nums);
  // console.log(diskmap.join(""));
  const defragged = defrag(diskmap);
  // console.log(defragged.join(""));
  return checksum(defragged);
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
