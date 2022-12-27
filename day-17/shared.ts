import { Sprite } from "./canvas.ts";

const flat = new Sprite(4, 1);
flat.pixels = ["@", "@", "@", "@"];

const plus = new Sprite(3, 3);
// prettier-ignore
plus.pixels = [
  ".", "#", ".",
  "#", "#", "#",
  ".", "#", ".",
]

const elle = new Sprite(3, 3);
// prettier-ignore
elle.pixels = [
  ".",".","@", 
  ".",".","@", 
  "@","@","@"
]

const tall = new Sprite(1, 4);
// prettier-ignore
tall.pixels = [
  "@", 
  "@", 
  "@", 
  "@",
]

const block = new Sprite(2, 2);
// prettier-ignore
block.pixels = [
  "@","@", 
  "@","@"
]

export const tetrominos: Sprite[] = [flat, plus, elle, tall, block];

/**
 * Find the largest repeating pattern in an array
 * will return the index where the repeating pattern begins
 */
export function findRepeat<T>(arr: T[]): number | undefined {
  for (let i = 0, len = arr.length; i < len; i++) {
    // check every sequence length which is lower or equal to half the
    // remaining array length: (this is important, otherwise we'll go out of bounds)
    for (let s = 1; s <= (len - i) / 2; s++) {
      // check if the sequences of length s which start
      // at i and (i + s (the one immediately following it)) are equal:
      let isEqual = true;
      for (let j = 0; j < s; j++) {
        if (arr[i + j] != arr[i + s + j]) {
          isEqual = false;
          break;
        }
      }

      if (isEqual) {
        return i;
      }
    }
  }
}
