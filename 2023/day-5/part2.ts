import { chunk } from "../../lib/arrays.ts";
const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

input = input.trim();

interface ConversionMap {
  /**
   * [ [destination, source, length], ... ]
   */
  data: number[][];
  result: number[][];
}

/****************************************
 * Part 2
 */

function setup(str: string): [number[], ConversionMap[]] {
  const [seedsMatch] = str.match(/^seeds:[\d\s]+\n/) ?? [];
  const seeds = seedsMatch?.substring(7).trim().split(/\s+/).map(Number);
  const allMaps: ConversionMap[] = [];

  const maps = str.matchAll(/([a-z-]+ map:)\n([\d\s]+\n?)+/g) ?? [];
  [...maps].forEach((map) => {
    const mapResult = map[0].trim().split(`\n`) ?? [];
    mapResult.shift();
    const lines = mapResult.map((line) => line.split(/\s+/).map(Number)).sort((
      a,
      b,
    ) => a[1] - b[1]);

    const newMap: ConversionMap = {
      data: lines,
      result: [],
    };
    allMaps.push(newMap);
  });

  return [seeds!, allMaps];
}

function setNextResult(map: ConversionMap, source: number[][]) {
  const result: number[][] = [];

  // we loop through pairs of tuples that are ranges [begin, end] inclusive
  for (const pair of source) {
    let handled = false;

    // check if the range falls within any of the mappings
    for (const [dest, src, len] of map.data) {
      const end = src + len;

      // if our range falls fully within a mapping
      // we just map the tuple and push to result
      if (pair[0] >= src && pair[1] < end) {
        const diff = dest - src;
        const leftMap = pair[0] + diff;
        const rightMap = pair[1] + diff;
        result.push([leftMap, rightMap]);
        handled = true;
        break;
      }

      // if a mapping falls completely within our current range
      // we need to split it up into 3 arrays
      if (src >= pair[0] && end <= pair[1]) {
        const arr1 = [pair[0], src - 1];
        const arr2 = [src, end - 1];
        const arr3 = [end, pair[1]];
        // put them all onto source so they can be handled by the code below
        source.push(arr1, arr2, arr3);
        handled = true;
      }

      // if the beginning range falls within one of the ranges but the end doesn't
      // we split it up into multiple tuples and only map the parts that match
      if (pair[0] >= src && pair[0] < end) {
        // split this up into new pairs
        const diff = dest - src;
        const leftMap = pair[0] + diff;
        result.push([leftMap, dest + len - 1]);
        source.push([end, pair[1]]);
        handled = true;
        break;
      }
    }

    if (!handled) {
      // no matches so just push back the pair
      result.push(pair!);
    }
    handled = false;
  }

  map.result = result;
}

export function part2(str: string): number {
  const [seedsOrignal, allMaps] = setup(str);

  // replace the "lengths" with the actual end of the range (seed + length)
  // example: [79 14 55 13] becomes [79, 92, 55, 67]
  for (let i = 0; i < seedsOrignal.length; i++) {
    if (i % 2 !== 0) {
      seedsOrignal[i] = seedsOrignal[i - 1] + (seedsOrignal[i] - 1);
    }
  }
  // and we chunk them into tuples [[79, 92], [55, 67]]
  const seeds = chunk(seedsOrignal, 2);

  let source = seeds;
  allMaps.forEach((m) => {
    setNextResult(m, source);
    source = m.result;
  });
  const lastResult = allMaps.at(-1)?.result.map((arr) => arr[0]);

  return Math.min(...lastResult!);
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
