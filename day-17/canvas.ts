// import { Buffer } from "https://deno.land/std/node/buffer.ts";

export class Sprite {
  pixels: string[] = [];
  width: number;
  height: number;
  modulos: number[] = [];

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.pixels = Array(w * h).fill("");

    // modulus are very slow apparently so caching them
    for (let i = 0, len = this.pixels.length; i < len; ++i) {
      this.modulos[i] = i % w;
    }
  }

  toString() {
    let str = "";
    let h = 0;
    while (h < this.height) {
      const start = h * this.width;
      const end = start + this.width;
      const row = this.pixels.slice(start, end);
      str += row.join("") + "\n";
      h++;
    }
    return str.trim();
  }
}

export class Canvas {
  /**
   * number of columns in the grid
   */
  width: number;

  /**
   * number of rows in the grid
   */
  height: number;
  pixels: string[] = [];
  tempSprite: { x: number; y: number; data: Sprite } | null = null;
  emptySpace: string;

  constructor(w: number, h: number, emptySpace: string = "") {
    this.width = w;
    this.height = h;
    this.emptySpace = emptySpace;
    this.pixels = Array(w * h).fill(this.emptySpace);
  }

  /**
   * inserts rows of empty spaces at the top
   */
  prepend(rows: number) {
    this.pixels = Array(this.width * rows)
      .fill(this.emptySpace)
      .concat(this.pixels);
    this.height += rows;
  }

  getIndex(x: number, y: number) {
    // knowing width and height,
    // for the args x and y, find the index in the flat array
    /*
     w = 5
     h = 4
     [
      .,.,.,.,.,
      .,.,1,.,.,
      .,.,.,.,.,
      .,.,.,.,2
     ]
     y * this.width + x;

     1. x:2, y: 1 --> should equal index 7
     (y:1 * this.width:5) + x:2
     (1 * 5) + 2 = 7

     2. x:4, y: 3 --> should equal index 19
     (y:3 * this.width:5) + x:4
     (3 * 5) + 4 = 19
    */
    return y * this.width + x;
  }

  drawSprite(sprite: Sprite, x: number, y: number, to: string[] = this.pixels) {
    let row = y;
    let col = x;
    /*
    [
      .......
      .._#_..
      ..###..
      .._#_..
     ]
     draw sprite as 2,1, which is index 9
     sprite is indexed 0 through 8 (9 length), width of 3 (cols) and height of 3 (rows)
     sprite row 1, starts at index 0, draws at 2,1 which is index 9, for 3 cols (9 through 11)
     sprite row 2, starts at index 3, draws at 2,2 which is index 16, for 3 cols (16 through 18)
     sprite row 3, starts at index 6, draws at 2,3 which is index 23, for 3 cols (23 through 25)
    */
    for (let i = 0; i < sprite.pixels.length; ++i) {
      const px = sprite.pixels[i];
      col = sprite.modulos[i] + x;
      if (i > 0 && sprite.modulos[i] === 0) {
        row += 1; // new row started
      }
      const index = this.getIndex(col, row);
      if (index < this.pixels.length && to[index] === this.emptySpace) {
        to[index] = px;
      }
    }
    return to;
  }

  /**
   * This is almost the same as the drawSprite method above except it compares what is at the
   * destination index on the canvas with the sprite's index if they are both not empty, it returns
   * false
   */
  canDraw(sprite: Sprite, x: number, y: number, to: string[] = this.pixels): boolean {
    let row = y;
    let col = x;

    for (let i = 0; i < sprite.pixels.length; ++i) {
      const px = sprite.pixels[i];
      col = sprite.modulos[i] + x;
      if (i > 0 && sprite.modulos[i] === 0) {
        row += 1; // new row started
      }
      const index = this.getIndex(col, row);
      if (index >= this.pixels.length) return false; // out of range
      const pixel = to[index];
      if (px !== this.emptySpace && pixel !== this.emptySpace) {
        return false;
      }
    }
    return true;
  }

  /**
   * Applies a sprite to the board only during the `toString()` method without persisting the sprite
   * into the canvas. Useful for animation purposes.
   */
  setSprite(sprite: Sprite, x: number, y: number) {
    this.tempSprite = {
      x,
      y,
      data: sprite,
    };
  }

  /**
   * Remove complete empty rows from the top of the canvas
   */
  trimStart() {
    /*
    ....... <-- remove
    ....... <-- remove
    ...#... 
    ..###..
    ...#...

    loop from top and stop until encounter first non-empty space ("#" in above example)
    "#" is at index 17, middle of row. Find beginning of row (index 14) using while loop and modulus
    slice starting from index 14 to the end, which will effectively remove top empty rows
    */
    let i = 0;
    for (; i < this.pixels.length; ++i) {
      // stop as soon as we encounter a non-emptySpace
      if (this.pixels[i] !== this.emptySpace) {
        break;
      }
    }
    // find the nearest beginning of a row
    while (i % this.width !== 0) {
      i--;
    }
    this.pixels = this.pixels.slice(i);
    this.height = this.pixels.length / this.width;
  }

  /**
   * convert the canvas to string. Apply temporary sprite if available.
   */
  toString(arr: string[] = this.pixels) {
    let pixelCopy: string[] = [...arr];
    if (this.tempSprite) {
      pixelCopy = this.drawSprite(
        this.tempSprite.data,
        this.tempSprite.x,
        this.tempSprite.y,
        pixelCopy
      );
    }
    let str = "";
    let h = 0;
    while (h < this.height) {
      const start = h * this.width;
      const end = start + this.width;
      const row = pixelCopy.slice(start, end);
      str += row.join("") + "\n";
      h++;
    }
    return str.trim();
  }
}
