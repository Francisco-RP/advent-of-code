const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = await Deno.readTextFile(__dirname + "/input.txt");
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/***********************************************************************
 * Part 1
 */

// bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes

function parseLine(line: string): number {
  let red = 0, blue = 0, green = 0;

  const [gameId, cubeSets] = line.split(":");
  const id = gameId.replace("Game ", "");
  const sets = cubeSets.split(";");

  for (const s of sets) {
    const matches = s.match(/(\d+ (red|green|blue))/g);
    if (matches) {
      for (const combo of matches) {
        const [count, color] = combo.split(" ");
        switch (color) {
          case "red":
            red += parseInt(count);
            if (red > 12) return 0;
            break;
          case "green":
            green += parseInt(count);
            if (green > 13) return 0;
            break;
          case "blue":
            blue += parseInt(count);
            if (blue > 14) return 0;
            break;
        }
      }
    }
    red = 0, blue = 0, green = 0;
  }

  return parseInt(id!);
}

export function part1(str: string): number {
  let total = 0;
  str.trim().split(`\n`).forEach((line) => {
    total += parseLine(line);
  });
  return total;
}

/***********************************************************************
 * Part 2
 */

function parseLine2(line: string): number {
  let red = 0, blue = 0, green = 0;

  const [, cubeSets] = line.split(":");
  const sets = cubeSets.split(";");

  for (const s of sets) {
    const matches = s.match(/(\d+ (red|green|blue))/g);
    if (matches) {
      for (const combo of matches) {
        const [count, color] = combo.split(" ");
        switch (color) {
          case "red":
            red = Math.max(red, parseInt(count));
            break;
          case "green":
            green = Math.max(green, parseInt(count));
            break;
          case "blue":
            blue = Math.max(blue, parseInt(count));
            break;
        }
      }
    }
  }
  return red * green * blue;
}

export function part2(str: string): number {
  let total = 0;
  str.trim().split(`\n`).forEach((line) => {
    total += parseLine2(line);
  });
  return total;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
  console.log(part2(input));
}
