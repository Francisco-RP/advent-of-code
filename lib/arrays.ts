type MatricCallback<T = string> = (x: number, y: number, item: T) => void;

function callAt<T = string>(x: number, y: number, matrix: T[][], callback: MatricCallback<T>) {
  if (matrix[y]?.[x]) callback(x, y, matrix[y][x]);
}

export function eachSurrounding<T = string>(
  x: number,
  y: number,
  matrix: T[][],
  callback: MatricCallback<T>,
  includeDiagonals = true
) {
  if (includeDiagonals) {
    // top left
    callAt(x - 1, y - 1, matrix, callback);
    // top right
    callAt(x + 1, y - 1, matrix, callback);
    // bottom left
    callAt(x - 1, y + 1, matrix, callback);
    // bottom right
    callAt(x + 1, y + 1, matrix, callback);
  }

  // up
  callAt(x, y - 1, matrix, callback);
  // right
  callAt(x + 1, y, matrix, callback);
  // down
  callAt(x, y + 1, matrix, callback);
  // left
  callAt(x - 1, y, matrix, callback);
}

export function chunk<T = number>(source: T[], size: 2): T[][] {
  const copy = [...source];
  const arr: T[][] = [];
  while (copy.length) {
    arr.push(copy.splice(0, size));
  }
  return arr;
}

export const sum = (arr: number[]): number => arr.reduce((total, n) => (total += n), 0);
