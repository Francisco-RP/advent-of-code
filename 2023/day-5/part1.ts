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
  /**
   * [ [destination, source, length], ... ]
   */
  data: number[][];
  result: number[];
}

/****************************************
 * Part 1
 */

function setup(str: string): [number[], ConversionMap[]] {
  const [seedsMatch] = str.match(/^seeds:[\d\s]+\n/) ?? [];
  const seeds = seedsMatch?.substring(7).trim().split(/\s+/).map(Number);
  const allMaps: ConversionMap[] = [];

  const maps = str.matchAll(/([a-z-]+ map:)\n([\d\s]+\n?)+/g) ?? [];
  [...maps].forEach((map) => {
    const mapResult = map[0].trim().split(`\n`) ?? [];
    mapResult.shift();
    const lines = mapResult.map((line) => line.split(/\s+/).map(Number));

    const newMap: ConversionMap = {
      data: lines,
      result: [],
    };
    allMaps.push(newMap);
  });

  return [seeds!, allMaps];
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
  const [seeds, allMaps] = setup(str);

  let source = seeds;
  allMaps.forEach((m) => {
    setResult(m, source!);
    source = m.result;
  });

  return Math.min(...allMaps.at(-1)!.result);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
