import { parser, mDist, Coord } from "./shared.ts";

class Cave {
  row: number;

  /**
   * Store locations of B or S
   */
  markers = new Set<number>();

  /**
   * Store locations that have been covered
   */
  covered = new Set<number>();

  constructor(row: number) {
    this.row = row;
  }

  addRange(sensor: Coord, beacon: Coord) {
    const dist = mDist(beacon.x, beacon.y, sensor.x, sensor.y);

    if (!this.overlaps(dist, sensor)) return;

    const diffY = Math.abs(sensor.y - this.row);
    const x1 = sensor.x - dist + diffY;
    const x2 = sensor.x + dist - diffY;

    for (let i = x1; i <= x2; i++) {
      this.covered.add(i);
    }

    if (sensor.y === this.row) {
      this.markers.add(sensor.x);
    }
    if (beacon.y === this.row) {
      this.markers.add(beacon.x);
    }
  }

  overlaps(dist: number, sensor: Coord) {
    return sensor.y - dist <= this.row && sensor.y + dist >= this.row;
  }

  /**
   * multiplying its x coordinate by 4000000 and then adding its y coordinate.
   */
  getFrequency(x: number, y: number): number {
    return x * 4000000 + y;
  }
}

export function part1(str: string, row: number): number {
  const { data } = parser(str);

  const cave = new Cave(row);

  data.forEach((d) => {
    cave.addRange(d.sensor, d.beacon);
  });

  return cave.covered.size - cave.markers.size;
}
