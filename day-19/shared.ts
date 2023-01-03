export type Resources = { ore: number; clay: number; obsidian: number; geode: number };

export interface BluePrint {
  blueprintId: number;
  oreRobot: Pick<Resources, "ore">;
  clayRobot: Pick<Resources, "ore">;
  obsidianRobot: Pick<Resources, "ore" | "clay">;
  geodeRobot: Pick<Resources, "ore" | "obsidian">;
}

const regexOnlyNumbers = new RegExp("\\d+", "g");

function parseLineToBp(str: string): BluePrint {
  const matches = str.match(regexOnlyNumbers)!;
  const [blueprintId, oreRobot, clayRobot, obsidianOre, obsidianClay, geodeOre, geodeObsidian] =
    matches.map(Number);
  return {
    blueprintId,
    oreRobot: { ore: oreRobot },
    clayRobot: { ore: clayRobot },
    obsidianRobot: { ore: obsidianOre, clay: obsidianClay },
    geodeRobot: { ore: geodeOre, obsidian: geodeObsidian },
  };
}

export function parseInput(str: string): BluePrint[] {
  return str.trim().split("\n").map(parseLineToBp);
}
