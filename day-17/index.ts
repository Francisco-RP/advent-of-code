import { tetrominos } from "./shared.ts";
import { addFrame, draw } from "./animation.ts";
import { Canvas, Sprite } from "./canvas.ts";

// wind pattern: If the end of the list is reached, it repeats.
// The tall, vertical chamber is exactly seven units wide.
// The rocks fall in the order shown above: first the "-" shape, then the "+" shape, and so on.
// each rock appears so that its left edge is two units away from the left wall and its bottom edge
// is three units above the highest rock in the room (or the floor, if there isn't one).

class Chamber {
  shapes: Sprite[];
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
  currentShape: Sprite = new Sprite(1, 1); // just to shut TS up

  constructor(shapes: Sprite[], moves: string, rocks: number) {
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

    this.currentShape = this.shapes[this.shapesIndex];
    this.left = 2;
    this.topEdge = -1;

    // always three lines between bottom of shape and height point on the board
    this.board.prepend(3);

    // insert rows with same height at current shape
    this.board.prepend(this.currentShape.height);
  }

  addFrame(move: string) {
    this.board.setSprite(this.currentShape, this.left, this.topEdge);
    addFrame(`
move ${move}
x: ${this.left}
y: ${this.topEdge}

${this.currentShape.toString()}

${this.board.toString()}`);
  }

  move() {
    const dir = this.moves[this.moveIndex];
    if (dir === "<" && this.canMoveLeft()) {
      this.left -= 1;
    } else if (dir === ">" && this.canMoveRight()) {
      this.left += 1;
    }
    // this.addFrame(dir);
    this.moveIndex++;
    if (this.moveIndex >= this.moves.length) {
      this.moveIndex = 0;
    }
  }

  drop() {
    this.topEdge += 1;
    // this.addFrame("⌄");
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
    if (this.left + this.currentShape.width >= 7) return false;
    return this.board.canDraw(this.currentShape, this.left + 1, this.topEdge);
  }

  canMoveDown() {
    return this.board.canDraw(this.currentShape, this.left, this.topEdge + 1);
  }

  rest() {
    const clone = new Sprite(this.currentShape.width, this.currentShape.height);
    clone.pixels = this.currentShape.pixels.map((px) => {
      if (px === "@") return "#";
      return px;
    });
    this.board.drawSprite(clone, this.left, this.topEdge);
  }

  begin() {
    while (this.rocks > 0) {
      this.getNextShape();

      while (this.canMoveDown()) {
        this.drop();
        this.move();
      }

      // draw current shape into this.board
      this.rest();
      this.rocks -= 1;
    }
  }

  getHeight() {
    this.board.trim();
    return this.board.height;
  }
}

export function part1(str: string, rocks: number): number {
  const tetris = new Chamber(tetrominos, str.trim(), rocks);
  tetris.begin();
  // draw(200);
  return tetris.getHeight();
}

if (Deno.env.get("DEBUGGING") === "true") {
  console.log(part1(">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>", 11));
}
// part1(">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>", 11);
