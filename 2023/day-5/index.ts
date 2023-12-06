import { chunk } from "../../lib/arrays.ts";
const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = await Deno.readTextFile(__dirname + "/input.txt");
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

input = input.trim();

interface ConversionMap {
  from?: string;
  to?: string;
  /**
   * [ [destination, source, length], ... ]
   */
  data: number[][];
  result: number[];
}

function setup(str: string): [number[], ConversionMap[]] {
  const [seedsMatch] = str.match(/^seeds:[\d\s]+\n/) ?? [];
  const seeds = seedsMatch?.substring(7).trim().split(/\s+/).map(Number);
  const allMaps: ConversionMap[] = [];

  const maps = str.matchAll(/([a-z-]+ map:)\n([\d\s]+\n?)+/g) ?? [];
  [...maps].forEach((map) => {
    const mapResult = map[0].trim().split(`\n`) ?? [];
    const mapName = mapResult.shift()?.replace(" map:", "").split("-to-") ?? [];
    const lines = mapResult.map((line) => line.split(/\s+/).map(Number));

    const newMap: ConversionMap = {
      from: mapName[0],
      to: mapName[1],
      data: lines,
      result: [],
    };
    allMaps.push(newMap);
  });

  return [seeds!, allMaps];
}

/***********************************************************************
 * Part 1
 */

function setResult(map: ConversionMap, source: number[]) {
  const result: number[] = source.map((n) => {
    for (const data of map.data) {
      const [dest, src, len] = data;
      if (n >= src && n <= src + len) {
        return dest + (n - src);
      }
    }
    return n;
  });
  map.result = result;
}

export function part1(str: string): number {
  const [seeds, allMaps] = setup(str);

  let source = seeds;
  allMaps.forEach((m) => {
    setResult(m, source!);
    source = m.result;
  });

  return Math.min(...allMaps.at(-1)!.result);
}

/***********************************************************************
 * Part 2
 */

export function part2(str: string): number {
  const [seedsOriginal, allMaps] = setup(str);
  const seeds: number[][] = chunk(seedsOriginal, 2);

  let min = Number.MAX_SAFE_INTEGER;

  // loops within loops within loops within loops
  for (const [seedStart, seedLength] of seeds) {
    for (let i = seedStart; i <= seedStart + seedLength; i++) {
      let source = [i];
      for (const m of allMaps) {
        setResult(m, source);
        source = m.result;
      }
      min = Math.min(...allMaps.at(-1)!.result, min);
    }
  }

  return min;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
  console.log(part2(input));
}
