type Coord = { x: number; y: number };

/**
 * this:
 * 498,4 -> 498,6 -> 496,6
 * 503,4 -> 502,4 -> 502,9 -> 494,9
 *
 * becomes:
 * [
 *  [ {x: 498, y: 4}, {x: 498, y: 6}], {x: 496, y: 6} ],
 *   ...etc
 * ]
 */
export function parser(str: string) {
  let minX: number | undefined = undefined;
  let maxX = 0;
  let height = 0;
  const lines = str
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        .split("->")
        .map((coord) => {
          const [x, y] = coord.trim().split(",").map(Number);
          if (x > maxX) maxX = x;
          if (typeof minX !== "number" || x < minX) minX = x;
          if (y > height) height = y;
          return { x, y };
        })
    );
  return { lines, minX: minX || 0, maxX, height };
}

function getLine(head: Coord, tail: Coord, coordSet: Set<string>) {
  // get all coordinates between 2 points
  // fill in line from head to tail
  if (head.x === tail.x) {
    const len = tail.y - head.y;
    if (len === 0) return;

    // only y changes
    for (let i = 0; i <= Math.abs(len); i++) {
      if (len < 0) {
        coordSet.add(`${tail.x},${tail.y + i}`);
      } else {
        coordSet.add(`${tail.x},${tail.y - i}`);
      }
    }
  } else {
    const len = tail.x - head.x;
    if (len === 0) return;

    // only x changes
    for (let i = 0; i <= Math.abs(len); i++) {
      if (len < 0) {
        coordSet.add(`${tail.x + i},${tail.y}`);
      } else {
        coordSet.add(`${tail.x - i},${tail.y}`);
      }
    }
  }
}

/**
 * @param {Coord[][]} lines
 * @return {Set} a set of all possible solid rock locations
 */
export function coords(lines: Coord[][]) {
  const lineSet = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const row = lines[i];
    for (let n = 1; n < lines[i].length; n++) {
      const head = row[n - 1];
      const tail = row[n];
      getLine(head, tail, lineSet);
    }
  }

  return lineSet;
}
