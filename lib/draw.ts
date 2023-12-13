/**
 * Pretty print a 2D grid to the console.
 */
export function drawGrid(grid: string[][]) {
  const display = grid.map((row) => row.join("")).join("\n");
  console.log(display);
}

/**
 * Pretty print an array and include index numbers.
 */
export function drawArray(arr: Array<string | number | boolean>) {
  let display = "[";
  for (let i = 0; i < arr.length; i++) {
    display += `${i}: ${arr[i]}`;
    if (i < arr.length - 1) {
      display += ", ";
    }
  }
  display += "]";
  console.log(display);
}
