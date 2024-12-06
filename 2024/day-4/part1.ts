const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  input = await Deno.readTextFile(__dirname + "/input.txt");
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 1
 */

function forward(row: number, col: number, matrix: string[][]): number {
  const xmas = matrix[row]?.[col] + matrix[row]?.[col + 1] +
    matrix[row]?.[col + 2] + matrix[row]?.[col + 3];
  return (xmas === "XMAS") ? 1 : 0;
}

function backwards(row: number, col: number, matrix: string[][]): number {
  const xmas = matrix[row]?.[col] + matrix[row]?.[col - 1] +
    matrix[row]?.[col - 2] + matrix[row]?.[col - 3];
  return (xmas === "XMAS") ? 1 : 0;
}
function down(row: number, col: number, matrix: string[][]): number {
  const xmas = matrix[row]?.[col] + matrix[row + 1]?.[col] +
    matrix[row + 2]?.[col] + matrix[row + 3]?.[col];
  return (xmas === "XMAS") ? 1 : 0;
}

function up(row: number, col: number, matrix: string[][]): number {
  const xmas = matrix[row]?.[col] + matrix[row - 1]?.[col] +
    matrix[row - 2]?.[col] + matrix[row - 3]?.[col];
  return (xmas === "XMAS") ? 1 : 0;
}

function upRight(row: number, col: number, matrix: string[][]): number {
  const xmas = matrix[row]?.[col] + matrix[row - 1]?.[col + 1] +
    matrix[row - 2]?.[col + 2] + matrix[row - 3]?.[col + 3];
  return (xmas === "XMAS") ? 1 : 0;
}

function downRight(row: number, col: number, matrix: string[][]): number {
  const xmas = matrix[row]?.[col] + matrix[row + 1]?.[col + 1] +
    matrix[row + 2]?.[col + 2] + matrix[row + 3]?.[col + 3];
  return (xmas === "XMAS") ? 1 : 0;
}

function upLeft(row: number, col: number, matrix: string[][]): number {
  const xmas = matrix[row]?.[col] + matrix[row - 1]?.[col - 1] +
    matrix[row - 2]?.[col - 2] + matrix[row - 3]?.[col - 3];
  return (xmas === "XMAS") ? 1 : 0;
}

function downLeft(row: number, col: number, matrix: string[][]): number {
  const xmas = matrix[row]?.[col] + matrix[row + 1]?.[col - 1] +
    matrix[row + 2]?.[col - 2] + matrix[row + 3]?.[col - 3];
  return (xmas === "XMAS") ? 1 : 0;
}

function search(matrix: string[][]): number {
  let count = 0;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const letter = matrix[row][col];
      if (letter === "X") {
        count += forward(row, col, matrix);
        count += backwards(row, col, matrix);
        count += down(row, col, matrix);
        count += up(row, col, matrix);
        count += upRight(row, col, matrix);
        count += downRight(row, col, matrix);
        count += upLeft(row, col, matrix);
        count += downLeft(row, col, matrix);
      }
    }
  }

  return count;
}

export function part1(str: string): number {
  const lines = str.trim().split(`\n`);
  const matrix = lines.map((line) => line.trim().split(""));
  return search(matrix);
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
