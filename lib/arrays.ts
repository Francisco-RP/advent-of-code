type MatricCallback<T = string> = (x: number, y: number, item: T) => void;

function callAt<T = string>(
  x: number,
  y: number,
  matrix: T[][],
  callback: MatricCallback<T>,
) {
  if (matrix[y]?.[x]) callback(x, y, matrix[y][x]);
}

export function eachSurrounding<T = string>(
  x: number,
  y: number,
  matrix: T[][],
  callback: MatricCallback<T>,
) {
  callAt(x - 1, y - 1, matrix, callback);
  callAt(x, y - 1, matrix, callback);
  callAt(x + 1, y - 1, matrix, callback);

  callAt(x - 1, y, matrix, callback);
  // we skip x,y because this is the point being surrounded
  callAt(x + 1, y, matrix, callback);

  callAt(x - 1, y + 1, matrix, callback);
  callAt(x, y + 1, matrix, callback);
  callAt(x + 1, y + 1, matrix, callback);
}

export function chunk<T = number>(source: T[], size: 2): T[][] {
  const copy = [...source];
  const arr: T[][] = [];
  while (copy.length) {
    arr.push(copy.splice(0, size));
  }
  return arr;
}
