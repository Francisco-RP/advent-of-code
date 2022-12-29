import { bfs, last } from "../lib.js";
import { parser, ValveData } from "./shared.ts";

class Cave {
  time = 30;
  currentValve: string;

  valves: Map<string, ValveData>;

  pressure = 0;
  totalRelease = 0;

  valvesWithFlow: string[] = [];

  logs: Array<string | number> = [];

  constructor(start: string, valves: Map<string, ValveData>) {
    this.logs.push(start);
    this.currentValve = start;
    this.valves = valves;
    // gather all valves that have a flow > 0
    this.valvesWithFlow = [...valves].filter(([_, val]) => val.flow > 0).map(([v]) => v);
  }

  // You estimate it will take you one minute to open a single valve
  // and one minute to follow any tunnel from one valve to another
  step(instruction: string, arg?: string) {
    switch (instruction) {
      case "move":
        if (arg) {
          this.currentValve = arg;
          this.logs.push(arg);
        }
        break;
      case "open":
        this.logs.push("open " + this.getCurrent().flow + "\n", this.currentValve);
        this.pressure += this.getCurrent().flow;
        this.getCurrent().opened = true;
        // remove valve from the opened list
        this.valvesWithFlow = this.valvesWithFlow.filter((v) => v !== this.currentValve);
        break;
      case "wait":
        break;
      default:
        throw `unknown instruction ${instruction}`;
    }
    this.updateTime();
    this.totalRelease += this.pressure;
  }

  updateTime() {
    this.time -= 1;
    if (this.time <= 0) {
      throw new Error("TIMES UP");
    }
  }

  getSteps(start: string): string[] {
    // from current valve, find steps to take to all possible unopened valves that have flow > 0
    // give each a score of Math.ceil(flow/steps) and pick the largest score
    // if there's a tie, choose the one with the least steps
    // move to that valve and open it
    // repeat

    const paths = this.valves.get(start)!.paths.filter((x) => x !== start);

    const currentPaths: string[][] = [];

    for (let i = 0; i < paths.length; i++) {
      const current = paths[i];
      currentPaths[i] = [];

      bfs(
        current,
        (v: string) => {
          if (v === start) return false;
          const valve = this.valves.get(v)!;
          const isEnd = !valve.opened && valve.flow > 0;
          currentPaths[i].push(v);
          return isEnd;
        },
        (v: string) => {
          const valve = this.valves.get(v);
          return valve?.paths || [];
        }
      );
    }

    currentPaths.sort((path1, path2) => {
      const flowA = this.valves.get(last(path1))!.flow;
      const flowB = this.valves.get(last(path2))!.flow;
      const flowAScore = Math.ceil(flowA / path1.length) - path1.length;
      const flowBScore = Math.ceil(flowB / path2.length) - path2.length;
      return flowAScore - flowBScore;
    });

    const bestPath = currentPaths.pop();
    return bestPath?.concat(["open"]) || [];
  }

  getCurrent() {
    return this.valves.get(this.currentValve)!;
  }

  begin() {
    while (true) {
      if (!this.valvesWithFlow.length) {
        // we've opened all of the valves so we just wait for the rest of the time
        this.step("wait");
        continue;
      }

      const stack = this.getSteps(this.currentValve);
      if (stack.length) {
        stack.forEach((action) => {
          if (action === "open") this.step("open");
          else this.step("move", action);
        });
      }
    }
  }
}

export function part1(str: string): number {
  const valves = parser(str);

  const start: string = valves.keys().next().value;

  const cave = new Cave(start, valves);

  try {
    cave.begin();
  } catch (e) {
    console.log(e.message);
  }

  console.log(cave.logs.join(" -> "));

  return cave.totalRelease;
}

if (Deno.env.get("DEBUGGING") === "true") {
  const testInput = `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;

  part1(testInput);
}
