export class Canvas {
  width: number;
  height: number;
  pixels: string[][] = [];
  sprite: { x: number; y: number; data: string[][] } | null = null;
  emptySpace: string;

  constructor(w: number, h: number, emptySpace: string = "") {
    this.width = w;
    this.height = h;
    this.emptySpace = emptySpace;
    this.updateCanvas(w, h);
  }

  /**
   * inserts rows of empty spaces at the top
   */
  prepend(rows: number) {
    for (let i = 0; i < rows; i++) {
      this.pixels.unshift([]);
      for (let x = 0; x < this.width; x++) {
        this.pixels[0].push(this.emptySpace);
      }
    }
    this.height += rows;
  }

  updateCanvas(width: number, height: number) {
    for (let y = 0; y < height; y++) {
      if (!Array.isArray(this.pixels[y])) {
        this.pixels[y] = [];
      }
      for (let x = 0; x < width; x++) {
        if (!this.pixels[y][x]) {
          this.pixels[y][x] = this.emptySpace;
        }
      }
    }
    this.height = height;
    this.width = width;
  }

  drawSprite(sprite: string[][], x: number, y: number, to: string[][] = this.pixels) {
    const width = sprite[0].length;
    const height = sprite.length;

    // y = 10 (0-indexed); height = 3 (1-indexed)
    // sprite rows 0,1,2 takes up canvas rows 10, 11, 12 (0-indexed)
    // x = 2 (0-indexed); width = 3 (1-indexed)
    // sprite cols 0,1,2 takes up canvas columns 2, 3, 4 (0-indexed)

    for (let spriteY = 0; spriteY < height; spriteY++) {
      for (let spriteX = 0; spriteX < width; spriteX++) {
        if (to[y + spriteY]?.[x + spriteX] === this.emptySpace) {
          to[y + spriteY][x + spriteX] = sprite[spriteY][spriteX];
        }
      }
    }
    return to;
  }

  canDraw(sprite: string[][], x: number, y: number, to: string[][] = this.pixels): boolean {
    const width = sprite[0].length;
    const height = sprite.length;

    for (let spriteY = 0; spriteY < height; spriteY++) {
      for (let spriteX = 0; spriteX < width; spriteX++) {
        const pixel = to[y + spriteY]?.[x + spriteX];
        if (!pixel) return false; // pixel out of range
        const spritePixel = sprite[spriteY][spriteX];
        if (spritePixel !== this.emptySpace && pixel !== this.emptySpace) {
          return false;
        }
      }
    }
    return true;
  }

  setSprite(sprite: string[][], x: number, y: number) {
    this.sprite = {
      x,
      y,
      data: structuredClone(sprite),
    };
  }

  trim() {
    const emptyRow = Array(this.width).fill(this.emptySpace).join("");
    this.pixels = this.pixels.filter((row) => {
      return row.join("") !== emptyRow;
    });
  }

  toString() {
    let pixelCopy: string[][] = structuredClone(this.pixels);
    if (this.sprite) {
      pixelCopy = this.drawSprite(this.sprite.data, this.sprite.x, this.sprite.y, pixelCopy);
    }
    return pixelCopy
      .map((row) => {
        return row.join("");
      })
      .join("\n");
  }
}
