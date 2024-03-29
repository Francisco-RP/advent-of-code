import { tetrominos, findRepeat } from "./shared.ts";
import { addFrame, draw } from "./animation.ts";
import { Canvas, Sprite } from "./canvas.ts";

// wind pattern: If the end of the list is reached, it repeats.
// The tall, vertical chamber is exactly seven units wide.
// The rocks fall in the order shown above: first the "-" shape, then the "+" shape, and so on.
// each rock appears so that its left edge is two units away from the left wall and its bottom edge
// is three units above the highest rock in the room (or the floor, if there isn't one).

class Chamber {
  // from constructor
  shapes: Sprite[];
  moves: string[];
  rocks: number;
  totalRocks: number;

  // calculated internally
  fallen = 0;
  shapesIndex = -1;
  moveIndex = 0;
  board = new Canvas(7, 0, ".");

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

  /**
   * Stores board height every time a shape stops and is draw into the board/canvas
   */
  heights: number[] = [];

  /**
   * Stores move index every time a shape stops and is draw into the board/canvas
   */
  lastMoves: number[] = [];

  repeatFound = false;

  /**
   * The calculated height from beginning to all complete repeated patterns
   */
  lastHeight = 0;

  animate = false;

  constructor(shapes: Sprite[], moves: string, rocks: number, animate: boolean = false) {
    this.shapes = shapes;
    this.moves = moves.split("");
    this.rocks = rocks;
    this.totalRocks = rocks;
    this.animate = animate;
  }

  checkForCycle() {
    if (this.repeatFound) {
      return;
    }

    this.lastMoves.push(this.moveIndex);
    this.heights.push(this.board.height);

    if (this.lastMoves.length < 4) {
      return;
    }

    const start = findRepeat(this.lastMoves);
    if (start === undefined) {
      return;
    }

    this.repeatFound = true;
    const arr = this.lastMoves.slice(start);
    const cycle = arr.slice(0, arr.length / 2);
    const heightPerCycle = this.heights[start + cycle.length - 1] - this.heights[start];

    this.cycleKnown(
      cycle.length,
      start + 1,
      heightPerCycle,
      this.lastMoves[start],
      this.heights[start - 1]
    );
  }

  cycleKnown(
    // how many rocks fall within a cycle
    rocksPerCycle: number,
    // the rock that the cycle starts at
    cycleStartsAt: number,
    // how much height is gained per cycle
    heightPerCycle: number,
    // the index of the move when the cycle begins
    moveIndex: number,
    // height BEFORE the first cycle starts
    heightAtStartOfCycle: number
  ) {
    const totalRocksInCycle = this.totalRocks - (cycleStartsAt - 1);
    const totalCycles = Math.floor(totalRocksInCycle / rocksPerCycle);
    const remainingRocks = totalRocksInCycle % rocksPerCycle;
    const heightOfAllCompleteCycles = heightPerCycle * totalCycles;

    if (remainingRocks === 0) {
      // STOP HERE, we should know the final height
      this.rocks = 0;
      this.lastHeight = heightOfAllCompleteCycles + heightAtStartOfCycle;
      return;
    }

    // start a fresh canvas
    this.board = new Canvas(7, 0, ".");
    // jump ahead to the last incomplete cycle
    this.rocks = remainingRocks;
    this.moveIndex = moveIndex;
    this.lastHeight = heightOfAllCompleteCycles + heightAtStartOfCycle;
    this.shapesIndex = 4;
    this.fallen = this.totalRocks - remainingRocks;

    /*
    encountered a cycle 
    starting when the 16th rock has fallen and stopped
    the rock was index 0
    creating a height of 26

    rocks 16 through 50
    repeating cycle of 35 rocks
    starting at rock 16
    total of 2022 rocks
    2022 - 16 = 2006 rocks in the cycle
    floor(2006 / 35) = 57 cycles 
    2006 % 35 = 11 remaining rocks in the unfinished last cycle
    --------
    16 + (35 * 57) + 11
    16 + 1995 + 11 = 2022


    Heights:
    beginning of first cycle at rock 15 -- height is 26
    beginning of 2nd cycle at rock 50 -- height is 79
    79 - 26 = 53 <-- each cycle increases height by 53

    height 25 <-- right before cycle started (start - 1)
    height 53 * 57 = 3021 <-- calculated height of all complete cycles
    
    we know the example input final answer should be 3068;
    3021 + 25 + x = 3068
    x = 22 <-- but how do we get that if we don't know final height yet
    we know the last cycle is 11 fallen rocks
    
    total 2022 - remaining 11 = 2011
    height is 3046 when last 11 rocks start

    set rock to 2011
    set height to 3046 (3021 + 25)
    set moveIndex to 0
    run the progression until we reach 2022 and get final height from there?
    */
  }

  getNextShape() {
    this.shapesIndex++;
    if (this.shapesIndex >= this.shapes.length) {
      this.shapesIndex = 0;
    }

    this.currentShape = this.shapes[this.shapesIndex];
    this.left = 2;
    this.topEdge = -1;

    // always three lines between bottom of shape and height point on the board
    this.board.prepend(3);

    // insert rows with same height at current shape
    this.board.prepend(this.currentShape.height);
  }

  /**
   * When `this.animate` is true, this will add frames into the stack
   */
  addFrame(move: string) {
    if (!this.animate) return;
    this.board.setSprite(this.currentShape, this.left, this.topEdge);
    addFrame(`
${this.board.toString()}

move ${move}
moveIndex: ${this.moveIndex}
pieceIndex: ${this.shapesIndex}
fallen: ${this.fallen}
remaining: ${this.rocks}
lastHeight: ${this.lastHeight}
height: ${this.board.height}
`);
  }

  move() {
    const dir = this.moves[this.moveIndex];
    if (dir === "<" && this.canMoveLeft()) {
      this.left -= 1;
    } else if (dir === ">" && this.canMoveRight()) {
      this.left += 1;
    }
    this.addFrame(dir);
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
    if (this.left + this.currentShape.width >= 7) return false;
    return this.board.canDraw(this.currentShape, this.left + 1, this.topEdge);
  }

  canMoveDown() {
    if (this.topEdge < 3) {
      // we know that 3 blank lines are inserted at the beginning of each new piece so
      // we can skip checking
      return true;
    }
    return this.board.canDraw(this.currentShape, this.left, this.topEdge + 1);
  }

  log() {
    // this helped me debug and also notice a repeating pattern in the moveIndexes
    console.log("fallen", this.fallen);
    console.log("piece", this.shapesIndex);
    console.log("move", this.moveIndex);
    console.log("height", this.board.height);
    console.log("left", this.left);
    console.log("");
  }

  rest() {
    const clone = new Sprite(this.currentShape.width, this.currentShape.height);
    clone.pixels = this.currentShape.pixels.map((px) => {
      if (px === "@") return "#";
      return px;
    });
    this.board.drawSprite(clone, this.left, this.topEdge);
    this.board.trimStart();
  }

  begin() {
    while (this.rocks > 0) {
      this.getNextShape();

      while (this.canMoveDown()) {
        this.drop();
        this.move();
      }

      this.rest();
      this.rocks -= 1;
      this.fallen += 1;
      // this.log();
      this.checkForCycle();
    }
  }

  getHeight() {
    this.board.trimStart();
    if (this.animate) {
      draw(50);
    }
    return this.board.height + this.lastHeight;
  }
}

export function findHeight(str: string, rocks: number): number {
  const tetris = new Chamber(tetrominos, str.trim(), rocks, false);
  tetris.begin();

  // uncomment to see the whole final tetris board
  // console.log(tetris.board.toString());

  return tetris.getHeight();
}

if (Deno.env.get("DEBUGGING") === "true") {
  console.log(findHeight(">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>", 2022));
} else if (import.meta.main) {
  console.log(findHeight(">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>", 2022));
}
