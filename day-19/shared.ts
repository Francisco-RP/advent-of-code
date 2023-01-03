export interface Costs {
  blueprintId: number;
  oreRobot: { ore: number };
  clayRobot: { ore: number };
  obsidianRobot: { ore: number; clay: number };
  geodeRobot: { ore: number; obsidian: number };
}

const re = new RegExp("\\d+", "g");

export function parseInput(str: string): Costs[] {
  return str
    .trim()
    .split("\n")
    .map((line) => {
      const matches = line.match(re)!;
      const [blueprintId, oreRobot, clayRobot, obsidianOre, obsidianClay, geodeOre, geodeObsidian] =
        matches.map(Number);
      return {
        blueprintId,
        oreRobot: { ore: oreRobot },
        clayRobot: { ore: clayRobot },
        obsidianRobot: { ore: obsidianOre, clay: obsidianClay },
        geodeRobot: { ore: geodeOre, obsidian: geodeObsidian },
      };
    });
}
