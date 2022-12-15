import { parser, mDist, Coord } from "./shared.ts";

// The distress beacon is not detected by any sensor

// The distress beacon must have x and y coordinates each no lower than 0 and no larger than
// 4000000.

// grid from 0,0 to 4_000_000, 4_000_000
// plot all areas cover by sensor scans
// get remaining unscanned areas

class Cave {
  constructor() {}

  /**
   * multiplying its x coordinate by 4000000 and then adding its y coordinate.
   */
  getFrequency(x: number, y: number): number {
    return x * 4_000_000 + y;
  }

  addRange(sensor: Coord, beacon: Coord) {
    // const dist = mDist(beacon.x, beacon.y, sensor.x, sensor.y);
    // const diffY = Math.abs(sensor.y - this.row);
    // const x1 = sensor.x - dist + diffY;
    // const x2 = sensor.x + dist - diffY;
    // for (let i = x1; i <= x2; i++) {
    //   this.covered.add(i);
    // }
  }
}

export function part2(str: string): number {
  const { data } = parser(str);

  const cave = new Cave();

  data.forEach((d) => {
    cave.addRange(d.sensor, d.beacon);
  });

  return 0;
}

if (Deno.env.get("DEBUGGING") === "true") {
  const testInput = `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
  `;

  part2(testInput);
}
