const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = await Deno.readTextFile(__dirname + "/input.txt");
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

input = input.trim();

interface Race {
  /**
   * time allowed for each race in milliseconds
   */
  time: number;
  /**
   * best distance ever recorded in that race in millimeters
   */
  record: number;
}

/***********************************************************************
 * Part 1
 */

function setup(str: string): Race[] {
  const races: Race[] = [];
  const [timeLine, distanceLine] = str.split(/\n/);
  const time = timeLine.match(/\d+/g)?.map(Number) || [];
  const distance = distanceLine.match(/\d+/g)?.map(Number) || [];
  for (let i = 0; i < time.length; i++) {
    races.push({
      time: time[i],
      record: distance[i],
    });
  }
  return races;
}

/**
 * find out how many ways to you can win the race
 */
function checkRace({ time, record }: Race): number {
  // I need to beat race.record within race.time
  // I start off at speed 0;
  // for every ms I hold, I gain 1mm/s
  // but I also waste 1ms of the race.time
  let ways = 0;
  let speed = 0;
  for (let i = 1; i <= time; i++) {
    speed += 1;
    const remainingTime = time - i;
    const dist = remainingTime * speed;
    if (dist > record) ways += 1;
  }

  return ways;
}

export function part1(str: string): number {
  const races = setup(str);
  const product = races.map(checkRace).reduce((prod, n) => prod * n, 1);
  return product;
}

/***********************************************************************
 * Part 2
 */

export function part2(str: string): number {
  const [timeLine, distanceLine] = str.split(/\n/);
  const [time] = timeLine.replace(/\s+/g, "").match(/\d+/g)?.map(Number) || [];
  const [distance] =
    distanceLine.replace(/\s+/g, "").match(/\d+/g)?.map(Number) || [];

  const result = checkRace({ time, record: distance });

  return result;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
  console.log(part2(input));
}
