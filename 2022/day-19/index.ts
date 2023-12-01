import { parseInput, BluePrint, Costs, Resources } from "./shared.ts";

const input = await Deno.readTextFile("./input.txt");

const testInput = `
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`;

/***********************************************************************
 * Part 1
 */

// use the obsidian to create some geode-cracking robots

// To collect the obsidian, you'll need waterproof obsidian-collecting robots. use clay to make them waterproof

// to harvest the clay, you'll need special-purpose clay-collecting robots. To make any type of robot, you'll need ore,

// Collecting ore requires ore-collecting robots with big drills. you have exactly one ore-collecting robot

// Each robot can collect 1 of its resource type per minute.
// It also takes one minute for the robot factory to construct any type of robot, although it consumes the necessary resources available when construction begins.
// you need to figure out which blueprint would maximize the number of opened geodes after 24 minutes by figuring out which robots to build and when to build them.

export class MaxGeodes {
  debug = false;

  // from constructor
  bp: BluePrint;
  maxMinutes: number;
  maxOreCost: number; // the most expensive ore cost for a robot

  // state
  res: Resources = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
  robots: Resources = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
  minute = 0;
  building: keyof Resources | undefined;

  constructor(bp: BluePrint, minutes: number) {
    this.bp = bp;
    this.maxMinutes = minutes;

    this.maxOreCost = Object.keys(bp)
      .filter((key) => key !== "blueprintId")
      .map((key) => bp[key as keyof Costs])
      .sort((a, b) => b.ore - a.ore)[0].ore;

    this.begin();
  }

  canBuildNextRound(type: keyof BluePrint) {
    if (type === "obsidianRobot") {
      return (
        this.res.ore + this.robots.ore >= this.bp.obsidianRobot.ore &&
        this.res.clay + this.robots.clay >= this.bp.obsidianRobot.clay
      );
    }

    if (type === "geodeRobot") {
      return (
        this.res.ore + this.robots.ore >= this.bp.geodeRobot.ore &&
        this.res.obsidian + this.robots.obsidian >= this.bp.geodeRobot.obsidian
      );
    }
  }

  nextBuilds() {
    const nextOrebot = Math.max(this.bp.oreRobot.ore - this.res.ore, 0);
    const nextClaybot = Math.max(this.bp.clayRobot.ore - this.res.ore, 0);
    const nextObsOre = Math.max(this.bp.obsidianRobot.ore - this.res.ore, 0);
    const nextObsClay = Math.max(this.bp.obsidianRobot.clay - this.res.clay, 0);
    const nextGeoOre = Math.max(this.bp.geodeRobot.ore - this.res.ore, 0);
    const nextGeoObs = Math.max(this.bp.geodeRobot.obsidian - this.res.obsidian, 0);
  }

  spend() {
    // try build geode robot first
    if (
      this.res.ore >= this.bp.geodeRobot.ore &&
      this.res.obsidian >= this.bp.geodeRobot.obsidian
    ) {
      this.building = "geode";
      this.res.ore -= this.bp.geodeRobot.ore;
      this.res.obsidian -= this.bp.geodeRobot.obsidian;
      this.verbose(
        `Spend ${this.bp.geodeRobot.ore} ore and ${this.bp.geodeRobot.obsidian} obsidian to start building a geode-cracking robot. `
      );
      return;
    }

    // then try obsidianRobots
    if (
      this.robots.obsidian < this.bp.geodeRobot.obsidian &&
      this.res.ore >= this.bp.obsidianRobot.ore &&
      this.res.clay >= this.bp.obsidianRobot.clay &&
      !this.canBuildNextRound("geodeRobot")
    ) {
      this.building = "obsidian";
      this.res.ore -= this.bp.obsidianRobot.ore;
      this.res.clay -= this.bp.obsidianRobot.clay;
      this.verbose(
        `Spend ${this.bp.obsidianRobot.ore} ore and ${this.bp.obsidianRobot.clay} clay to start building an obsidian-collecting robot.`
      );
      return;
    }

    // else clayRobots
    if (
      this.robots.clay < this.bp.obsidianRobot.clay &&
      this.res.ore >= this.bp.clayRobot.ore &&
      !this.canBuildNextRound("obsidianRobot") &&
      !this.canBuildNextRound("geodeRobot")
    ) {
      this.res.ore -= this.bp.clayRobot.ore;
      this.building = "clay";
      this.verbose(`Spend ${this.bp.clayRobot.ore} ore to start building a clay-collecting robot.`);
      return;
    }

    // and finally oreRobots
    if (this.robots.ore < this.maxOreCost && this.res.ore >= this.bp.oreRobot.ore) {
      this.res.ore -= this.bp.oreRobot.ore;
      this.building = "ore";
      return;
    }
  }

  collect() {
    this.res.ore += this.robots.ore;
    this.verbose(
      `${this.robots.ore} ore-collecting robot collects ${this.robots.ore} ore; you now have ${this.res.ore} ore.`
    );

    this.res.clay += this.robots.clay;
    if (this.robots.clay > 0)
      this.verbose(
        `${this.robots.clay} clay-collecting robots collect ${this.robots.clay} clay; you now have ${this.res.clay} clay.`
      );

    this.res.obsidian += this.robots.obsidian;
    if (this.robots.obsidian > 0) {
      this.verbose(
        `${this.robots.obsidian} obsidian-collecting robots collect ${this.robots.obsidian} obsidian; you now have ${this.res.obsidian} obsidian.`
      );
    }

    this.res.geode += this.robots.geode;
    if (this.robots.geode > 0) {
      this.verbose(
        `${this.robots.geode} geode-cracking robots crack ${this.robots.geode} geodes; you now have ${this.res.geode} open geodes.`
      );
    }
  }

  built() {
    if (this.building) {
      this.robots[this.building] += 1;
      this.verbose(
        `The new ${this.building}-collecting robot is ready; you now have ${
          this.robots[this.building]
        } of them.`
      );
      this.building = undefined;
    }
  }

  begin() {
    while (this.minute < this.maxMinutes) {
      this.minute += 1;
      this.verbose(`== Minute ${this.minute} ==`);
      // this.log("before");
      this.spend();
      this.collect();
      this.built();
      // this.log("after");
      this.verbose("");
    }
  }

  getQualityLevel() {
    /**
     * Determine the quality level of each blueprint by multiplying that blueprint's ID number with
     * the largest number of geodes that can be opened in `this.maxMinutes` using that blueprint.
     */
    return this.bp.blueprintId * this.res.geode;
  }

  log(state = "") {
    console.log(`${state}
\tRobots\tResources
ore:\t${this.robots.ore}\t${this.res.ore}
clay:\t${this.robots.clay}\t${this.res.clay}
obsd:\t${this.robots.obsidian}\t${this.res.obsidian}
geod:\t${this.robots.geode}\t${this.res.geode}
`);
  }

  // deno-lint-ignore no-explicit-any
  verbose(...args: any[]) {
    if (!this.debug) return;
    console.log(...args);
  }
}

export function part1(str: string): number {
  const bps = parseInput(str);

  // run each blueprint and sum up all of the quality levels
  return bps
    .map((bp) => {
      const runBp = new MaxGeodes(bp, 24);
      return runBp.getQualityLevel();
    })
    .reduce((a, b) => a + b, 0);
}

if (Deno.env.get("DEBUGGING") === "true") {
  console.log(part1(testInput));
} else if (import.meta.main) {
  console.time("part 1");
  console.log(part1(input));
  console.timeEnd("part 1");
}
