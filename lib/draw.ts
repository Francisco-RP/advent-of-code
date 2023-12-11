export function drawGrid(grid: string[][], x: number, y: number, tile: string) {
  let result = "";
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      result += grid[row][col];
    }
    result += `\n`;
  }
  console.log(result);
}
