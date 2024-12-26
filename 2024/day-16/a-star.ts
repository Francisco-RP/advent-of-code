/****************
 * Utils
 */

/**
 * Euclidean Distance √( (x₂-x₁)² + (y₂-y₁)² )
 */
export function euclideanDistance(point1: Point, point2: Point): number {
  return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

/**
 * Manhattan distance formular: |x1 - x2| + |y1 - y2|
 * @param point1
 * @param point2
 */
export function manhattanDistance(point1: Point, point2: Point) {
  return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
}

/*****************************************
 * implementation A* Algorithm
 * pseudocode sourced from wikipedia
 */

export type IsSpace = (point: Point) => boolean;
export type CalcH = (p: Point) => number;
type PointToNumberMap = Map<Point, number>;
type PointToPointMap = Map<Point, Point>;
export type Point = [x: number, y: number, dir?: string];

export function a_star(allSpaces: Point[], start: Point, goal: Point, h: CalcH, isSpace: IsSpace) {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  const openSet: Point[] = [start];
  const visited: Set<Point> = new Set();

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
  // to n currently known.
  const cameFrom: PointToPointMap = new Map();

  // For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
  const gScore: PointToNumberMap = new Map();

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  const fScore: PointToNumberMap = new Map();

  for (const space of allSpaces) {
    if (space === start) {
      gScore.set(start, 0);
      fScore.set(start, h(start));
    } else {
      gScore.set(space, Number.POSITIVE_INFINITY);
      fScore.set(space, Number.POSITIVE_INFINITY);
    }
  }

  while (openSet.length) {
    // current := the node in openSet having the lowest fScore[] value
    // we will sort openSet descending by fScore so we can just pop
    const current = openSet.pop()!;

    if (current === goal) {
      return reconstruct_path(cameFrom, current);
    }

    if (visited.has(current)) {
      continue;
    } else {
      visited.add(current);
    }

    // for each neighbor of current
    const up = allSpaces.find(([x, y]) => x === current[0] && y === current[1] - 1);
    if (up && isSpace(up)) checkNeighbor(current, up, gScore, fScore, cameFrom, openSet, h);

    const down = allSpaces.find(([x, y]) => x === current[0] && y === current[1] + 1);
    if (down && isSpace(down)) checkNeighbor(current, down, gScore, fScore, cameFrom, openSet, h);

    const left = allSpaces.find(([x, y]) => x === current[0] - 1 && y === current[1]);
    if (left && isSpace(left)) checkNeighbor(current, left, gScore, fScore, cameFrom, openSet, h);

    const right = allSpaces.find(([x, y]) => x === current[0] + 1 && y === current[1]);
    if (right && isSpace(right))
      checkNeighbor(current, right, gScore, fScore, cameFrom, openSet, h);

    openSet.sort((a, b) => fScore.get(b)! - fScore.get(a)!);
  }

  throw new Error("no path available to the end");
}

function d(old: Point, next: Point): [1 | 1001, string] {
  switch (true) {
    case old[0] < next[0] && old[1] === next[1]: {
      if (old[2] === ">") return [1, ">"];
      return [1001, ">"];
    }
    case old[0] > next[0] && old[1] === next[1]: {
      // heading left
      if (old[2] === "<") return [1, "<"];
      return [1001, "<"];
    }
    case old[0] === next[0] && old[1] < next[1]: {
      if (old[2] === "v") return [1, "v"];
      return [1001, "v"];
    }
    case old[0] === next[0] && old[1] > next[1]:
    default: {
      if (old[2] === "^") return [1, "^"];
      return [1001, "^"];
    }
  }
}

function checkNeighbor(
  current: Point,
  neighbor: Point,
  gScore: PointToNumberMap,
  fScore: PointToNumberMap,
  cameFrom: PointToPointMap,
  openSet: Point[],
  h: CalcH
) {
  const current_gScore = gScore.get(current)!;
  const neighbor_gScore = gScore.get(neighbor)!;

  // d(current,neighbor) is the weight of the edge from current to neighbor
  // tentative_gScore is the distance from start to the neighbor through current
  // tentative_gScore := gScore[current] + d(current, neighbor)
  const [tentative_distance, tentative_dir] = d(current, neighbor);
  const tentative_gScore = current_gScore + tentative_distance; // since only doing up/down/left/right, it will always be +1

  // if tentative_gScore < gScore[neighbor]
  if (tentative_gScore < neighbor_gScore) {
    neighbor[2] = tentative_dir;
    // This path to neighbor is better than any previous one. Record it!

    //     cameFrom[neighbor] := current
    cameFrom.set(neighbor, current);

    //     gScore[neighbor] := tentative_gScore
    gScore.set(neighbor, tentative_gScore);

    //     fScore[neighbor] := tentative_gScore + h(neighbor)
    fScore.set(neighbor, tentative_gScore + h(neighbor));

    //     if neighbor not in openSet
    // we checked this already before getting here
    openSet.push(neighbor);
  }
}

function reconstruct_path(cameFrom: PointToPointMap, current: Point) {
  // total_path := {current}
  const total_path: Point[] = [current];
  // while current in cameFrom.Keys:
  while (cameFrom.has(current)) {
    //     current := cameFrom[current]
    current = cameFrom.get(current)!;
    //     total_path.prepend(current)
    total_path.unshift(current);
  }
  return total_path;
}
