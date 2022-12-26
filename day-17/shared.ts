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
