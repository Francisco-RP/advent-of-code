import { parseInput, Costs } from "./shared.ts";

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

export class Blueprint {
  costs: Costs;
  debug = false;

  // max number of Ore needed per minute to build anything
  // stop making more ore robots if max ore is reach
  maxOre: number;
  maxClay: number;
  maxObsidian: number;

  ore = 0;
  oreRobots = 1;

  clay = 0;
  clayRobots = 0;

  obsidian = 0;
  obsidianRobots = 0;

  geodes = 0;
  geodeRobots = 0;

  minute = 0;
  maxMinutes = 24;

  building: "oreRobots" | "clayRobots" | "obsidianRobots" | "geodeRobots" | undefined;

  constructor(costs: Costs) {
    this.costs = costs;

    this.maxOre = Object.keys(costs)
      .filter((key) => key !== "blueprintId" && key !== "oreRobot")
      .map((key) => costs[key as keyof Omit<Costs, "blueprintId">])
      .sort((a, b) => b.ore - a.ore)[0].ore;

    this.maxClay = costs.obsidianRobot.clay;
    this.maxObsidian = costs.geodeRobot.obsidian;
  }

  canBuildNextRound(type: "obsidianRobots" | "geodeRobots") {
    if (type === "obsidianRobots") {
      return (
        this.ore + this.oreRobots >= this.costs.obsidianRobot.ore &&
        this.clay + this.clayRobots * 2 >= this.costs.obsidianRobot.clay
      );
    }

    if (type === "geodeRobots") {
      return (
        this.ore + this.oreRobots >= this.costs.geodeRobot.ore &&
        this.obsidian + this.obsidianRobots >= this.costs.geodeRobot.obsidian
      );
    }
  }

  spend() {
    // try build geodeRobots first
    if (this.ore >= this.costs.geodeRobot.ore && this.obsidian >= this.costs.geodeRobot.obsidian) {
      this.building = "geodeRobots";
      this.ore -= this.costs.geodeRobot.ore;
      this.obsidian -= this.costs.geodeRobot.obsidian;
      this.verbose(
        `Spend ${this.costs.geodeRobot.ore} ore and ${this.costs.geodeRobot.obsidian} obsidian to start building a geode-cracking robot. `
      );
      return;
    }

    // then try obsidianRobots
    if (
      this.ore >= this.costs.obsidianRobot.ore &&
      this.clay >= this.costs.obsidianRobot.clay &&
      !this.canBuildNextRound("geodeRobots")
    ) {
      this.building = "obsidianRobots";
      this.ore -= this.costs.obsidianRobot.ore;
      this.clay -= this.costs.obsidianRobot.clay;
      this.verbose(
        `Spend ${this.costs.obsidianRobot.ore} ore and ${this.costs.obsidianRobot.clay} clay to start building an obsidian-collecting robot.`
      );
      return;
    }

    // else clayRobots
    if (
      this.ore >= this.costs.clayRobot.ore &&
      !this.canBuildNextRound("obsidianRobots") &&
      !this.canBuildNextRound("geodeRobots")
    ) {
      this.ore -= this.costs.clayRobot.ore;
      this.building = "clayRobots";
      this.verbose(
        `Spend ${this.costs.clayRobot.ore} ore to start building a clay-collecting robot.`
      );
      return;
    }

    // and finally oreRobots
    if (this.ore >= this.costs.oreRobot.ore) {
      this.ore -= this.costs.oreRobot.ore;
      this.building = "oreRobots";
      return;
    }
  }

  collect() {
    this.ore += this.oreRobots;
    this.verbose(
      `${this.oreRobots} ore-collecting robot collects ${this.oreRobots} ore; you now have ${this.ore} ore.`
    );

    this.clay += this.clayRobots;
    if (this.clayRobots > 0)
      this.verbose(
        `${this.clayRobots} clay-collecting robots collect ${this.clayRobots} clay; you now have ${this.clay} clay.`
      );

    this.obsidian += this.obsidianRobots;
    if (this.obsidianRobots > 0) {
      this.verbose(
        `${this.obsidianRobots} obsidian-collecting robots collect ${this.obsidianRobots} obsidian; you now have ${this.obsidian} obsidian.`
      );
    }

    this.geodes += this.geodeRobots;
    if (this.geodeRobots > 0) {
      this.verbose(
        `${this.geodeRobots} geode-cracking robots crack ${this.geodeRobots} geodes; you now have ${this.geodes} open geodes.`
      );
    }
  }

  built() {
    if (this.building) {
      this[this.building] += 1;
      this.verbose(
        `The new ${this.building.replace("Robots", "")}-collecting robot is ready; you now have ${
          this[this.building]
        } of them.`
      );
      this.building = undefined;
    }
  }

  begin() {
    while (this.minute < this.maxMinutes) {
      this.minute += 1;
      this.verbose(`== Minute ${this.minute} ==`);
      this.spend();
      this.collect();
      this.built();
      this.log();
      this.verbose("");
    }
  }

  getQualityLevel() {
    return this.costs.blueprintId * this.geodes;
  }

  log() {
    this.verbose(`
\tRobots\tResources
ore:\t${this.oreRobots}\t${this.ore}
clay:\t${this.clayRobots}\t${this.clay}
obsd:\t${this.obsidianRobots}\t${this.obsidian}
geod:\t${this.geodeRobots}\t${this.geodes}
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

  return bps
    .map((bp) => {
      const check = new Blueprint(bp);
      check.begin();
      return check.getQualityLevel();
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
