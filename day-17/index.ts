import { tetrominos } from "./shared.ts";
import { addFrame, draw } from "./animation.ts";
import { Canvas } from "./terminal-canvas.ts";

// wind pattern: If the end of the list is reached, it repeats.
// The tall, vertical chamber is exactly seven units wide.
// The rocks fall in the order shown above: first the "-" shape, then the "+" shape, and so on.
// each rock appears so that its left edge is two units away from the left wall and its bottom edge
// is three units above the highest rock in the room (or the floor, if there isn't one).

class Chamber {
  shapes: string[][][];
  moves: string[];
  rocks: number;

  shapesIndex = -1;
  moveIndex = 0;
  board: Canvas;

  /**
   * index of the left side of the column where the shape starts
   * |..@@@@.| <- left edge is 2 where the left most '@' character is
   */
  left = 2;
  /**
   * the row index where the top of the shape starts
   * 0 |.......|
   * 1 |...@@..| <-- this would be the topEdge
   * 2 |...@@..|
   */
  topEdge = 0;
  currentShape: string[][] = [];

  constructor(shapes: string[][][], moves: string, rocks: number) {
    this.shapes = shapes;
    this.moves = moves.split("");
    this.rocks = rocks;
    this.board = new Canvas(7, 1, ".");
  }

  getNextShape() {
    this.shapesIndex++;
    if (this.shapesIndex >= this.shapes.length) {
      this.shapesIndex = 0;
    }

    this.board.trim();
    this.currentShape = structuredClone(this.shapes[this.shapesIndex]);
    this.left = 2;
    this.topEdge = 0;

    // always three lines between bottom of shape and height point on the board
    this.board.prepend(3);

    // insert rows with same height at current shape
    this.board.prepend(this.currentShape.length);
  }

  addFrame(move: string) {
    this.board.setSprite(this.currentShape, this.left, this.topEdge);
    const sprite = this.currentShape.map((row) => row.join("")).join("\n");
    addFrame(`
move ${move}
x: ${this.left}
y: ${this.topEdge}

${sprite}

${this.board.toString()}`);
  }

  move() {
    const dir = this.moves[this.moveIndex];
    if (dir === "<" && this.canMoveLeft()) {
      this.left -= 1;
      this.addFrame(dir);
    } else if (dir === ">" && this.canMoveRight()) {
      this.left += 1;
      this.addFrame(dir);
    }
    this.moveIndex++;
    if (this.moveIndex >= this.moves.length) {
      this.moveIndex = 0;
    }
  }

  drop() {
    this.topEdge += 1;
    this.addFrame("⌄");
  }

  canMoveLeft(): boolean {
    if (this.left === 0) return false;
    return this.board.canDraw(this.currentShape, this.left - 1, this.topEdge);
  }

  canMoveRight(): boolean {
    // |...._@_| left = 4, length = 3
    // |......@| left = 6, length = 1
    // |.....@@| left = 5, length = 2
    // |....@@@| left = 4, length = 3
    // |...@@@@| left = 3, length = 4
    if (this.left + this.currentShape[0].length >= 7) return false;
    return this.board.canDraw(this.currentShape, this.left + 1, this.topEdge);
  }

  canMoveDown() {
    return this.board.canDraw(this.currentShape, this.left, this.topEdge + 1);
  }

  rest() {
    const sprite = this.currentShape.map((row) => {
      return row.map((col) => col.replace("@", "#"));
    });
    this.board.drawSprite(sprite, this.left, this.topEdge);
  }

  begin() {
    while (this.rocks > 0) {
      // insert new shape, and reset values
      // this also counts as the first fall
      this.getNextShape();

      while (this.canMoveDown()) {
        this.move(); // move left or right
        this.drop(); // drop 1
      }

      this.move();

      // draw current shape into this.board
      this.rest();
      this.rocks -= 1;
    }
  }

  getHeight() {
    this.board.trim();
    return this.board.pixels.length;
  }
}

export function part1(str: string): number {
  const tetris = new Chamber(tetrominos, str, 11);
  tetris.begin();
  draw(500);
  return tetris.getHeight();
}

if (Deno.env.get("DEBUGGING") === "true") {
  part1(">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>");
} else {
  part1(">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>");
}
