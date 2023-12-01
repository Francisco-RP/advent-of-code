export interface ValveData {
  name: string;
  flow: number;
  opened: boolean;
  paths: string[];
}

const re = new RegExp("Valve ([A-Z]{2}) has flow rate=(\\d+); tunnels? leads? to valves? (.+)");

// https://csacademy.com/app/graph_editor/

export function parser(str: string): Map<string, ValveData> {
  // using a map because I want to remember insertion order so that I can get the starting valve easily
  const valves = new Map<string, ValveData>();

  str
    .trim()
    .split("\n")
    .forEach((line) => {
      const match = line.trim().match(re);
      if (match) {
        const [, valve, flow, leadTo] = match;
        valves.set(valve, {
          name: valve,
          flow: +flow,
          opened: false,
          paths: leadTo.split(", "),
        });
      }
    });

  // [...valves].forEach(([name, v]) => {
  //   v.paths.forEach((p) => {
  //     console.log(`${name}-${v.flow} ${p}-${valves.get(p)!.flow}`);
  //   });
  // });

  return valves;
}
