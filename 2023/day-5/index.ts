const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = await Deno.readTextFile(__dirname + "/input.txt");
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

input = input.trim();

/***********************************************************************
 * Part 1
 */

interface ConversionMap {
  from?: string;
  to?: string;
  /**
   * [[destination, source, length]]
   */
  data: number[][];
  result: number[];
}

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
  const [seedsMatch] = str.match(/^seeds:[\d\s]+\n/) ?? [];
  const seeds = seedsMatch?.substring(7).trim().split(/\s+/).map(Number);
  const allMaps: ConversionMap[] = [];

  const maps = str.matchAll(/([a-z-]+ map:)\n([\d\s]+\n?)+/g) ?? [];
  [...maps].forEach((map) => {
    const mapResult = map[0].trim().split(`\n`) ?? [];
    // const mapName = mapResult.shift()?.replace(" map:", "").split("-to-") ?? [];
    const lines = mapResult.map((line) => line.split(/\s+/).map(Number));

    const newMap: ConversionMap = {
      // from: mapName[0],
      // to: mapName[1],
      data: lines,
      result: [],
    };
    allMaps.push(newMap);
  });

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
  const [seedsMatch] = str.match(/^seeds:[\d\s]+\n/) ?? [];
  const seedsOriginal = seedsMatch?.substring(7).trim().split(/\s+/).map(
    Number,
  )!;

  const seeds: number[] = [];
  for (
    let i = seedsOriginal[0];
    i <= seedsOriginal[0] + seedsOriginal[1];
    i++
  ) {
    seeds.push(i);
  }
  for (
    let i = seedsOriginal[2];
    i <= seedsOriginal[2] + seedsOriginal[3];
    i++
  ) {
    seeds.push(i);
  }

  const allMaps: ConversionMap[] = [];

  const maps = str.matchAll(/([a-z-]+ map:)\n([\d\s]+\n?){2}/g) ?? [];
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

  let source = seeds;
  allMaps.forEach((m) => {
    setResult(m, source!);
    source = m.result;
  });

  return Math.min(...allMaps.at(-1)!.result);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
  console.log(part2(input));
}
