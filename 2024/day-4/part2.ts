const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/****************************************
 * Part 2
 */

function checkLeft(row: number, col: number, matrix: string[][]): boolean {
  const a = matrix[row][col];
  const upLeft = matrix[row - 1]?.[col - 1];
  const downRight = matrix[row + 1]?.[col + 1];
  const mas = upLeft + a + downRight;
  return mas === "MAS" || mas === "SAM";
}
function checkRight(row: number, col: number, matrix: string[][]): boolean {
  const a = matrix[row][col];
  const upRight = matrix[row - 1]?.[col + 1];
  const downLeft = matrix[row + 1]?.[col - 1];
  const mas = downLeft + a + upRight;
  return mas === "MAS" || mas === "SAM";
}

function search(matrix: string[][]): number {
  let count = 0;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const letter = matrix[row][col];
      if (letter === "A") {
        const x1 = checkLeft(row, col, matrix);
        const x2 = checkRight(row, col, matrix);
        if (x1 && x2) count += 1;
      }
    }
  }

  return count;
}

export function part2(str: string): number {
  const lines = str.trim().split(`\n`);
  const matrix = lines.map((line) => line.trim().split(""));
  return search(matrix);
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
