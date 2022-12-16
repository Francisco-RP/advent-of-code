export interface Coord {
  x: number;
  y: number;
}

export interface Signal {
  sensor: Coord;
  beacon: Coord;
}

const re = new RegExp(
  "Sensor at x=(-?\\d+), y=(-?\\d+): closest beacon is at x=(-?\\d+), y=(-?\\d+)"
);

export function parser(str: string): {
  data: Signal[];
  min: Coord;
  max: Coord;
} {
  let largestX = 0;
  let largestY = 0;
  let lowestX = 0;
  let lowestY = 0;

  const data = str
    .trim()
    .split("\n")
    .map((line) => {
      const [, sensorX, sensorY, beaconX, beaconY] = line.match(re)!;

      // for the sensor only
      largestX = Math.max(largestX, +sensorX);
      largestY = Math.max(largestY, +sensorY);
      lowestX = Math.min(lowestX, +sensorX);
      lowestY = Math.min(lowestY, +sensorY);

      return {
        sensor: { x: +sensorX, y: +sensorY },
        beacon: { x: +beaconX, y: +beaconY },
      };
    });

  return {
    data,
    min: { x: lowestX, y: lowestY },
    max: { x: largestX, y: largestY },
  };
}

/**
 * Manhattan Distance
 */
export function mDist(X1: number, Y1: number, X2: number, Y2: number) {
  return Math.abs(X2 - X1) + Math.abs(Y2 - Y1);
}
