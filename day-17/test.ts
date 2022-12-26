import { assertStrictEquals, assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import { part1 } from "./index.ts";
import { Canvas } from "./terminal-canvas.ts";
// import { part2 } from ".";

const input = await Deno.readTextFile("./input.txt");
const testInput = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

// Deno.test("part 1 example input", () => {
//   assertStrictEquals(part1(testInput), 3068);
// });

// Deno.test("Part 1 still produces the accepted answer", () => {
//   assertStrictEquals(part1(input), 111111111111111);
// });

// Deno.test("part 2 example input", () => {
//   assertStrictEquals(part2(testInput), 1111111111111);
// });

// Deno.test("Part 2 still produces the accepted answer", () => {
//   assertStrictEquals(part2(input), 111111111111111);
// });

Deno.test("Canvas sets pixels correctly", () => {
  const canvas = new Canvas(7, 4, ".");
  const expected = [
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
  ];
  assertEquals(canvas.pixels, expected);
});

Deno.test("Canvas places sprite fully within board", () => {
  const canvas = new Canvas(7, 4, ".");
  const sprite = [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ];
  canvas.drawSprite(sprite, 2, 1);
  const expected = [
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", "#", ".", ".", "."],
    [".", ".", "#", "#", "#", ".", "."],
    [".", ".", ".", "#", ".", ".", "."],
  ];
  assertEquals(canvas.pixels, expected);
});

Deno.test("Canvas places sprite partial within board", () => {
  const canvas = new Canvas(7, 4, ".");
  const sprite = [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ];
  canvas.drawSprite(sprite, 2, 3);
  const expected = [
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", "#", ".", ".", "."],
  ];
  assertEquals(canvas.pixels, expected);
});

Deno.test("Canvas draw sprite doesnt overwrite board", () => {
  const canvas = new Canvas(7, 2, ".");
  const pixel: string[][] = [["#"]];
  const sprite = [
    [".", "#"],
    [".", "#"],
  ];
  canvas.drawSprite(pixel, 0, 0);
  canvas.drawSprite(pixel, 0, 1);
  canvas.drawSprite(pixel, 1, 1);
  canvas.drawSprite(sprite, 1, 0);
  const expected = [
    ["#", ".", "#", ".", ".", ".", "."],
    ["#", "#", "#", ".", ".", ".", "."],
  ];
  assertEquals(canvas.pixels, expected);
});

Deno.test("Canvas changing height", () => {
  const canvas = new Canvas(7, 4, ".");
  const sprite = [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ];
  canvas.drawSprite(sprite, 2, 1);
  canvas.updateCanvas(7, 6);
  const expected = [
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", "#", ".", ".", "."],
    [".", ".", "#", "#", "#", ".", "."],
    [".", ".", ".", "#", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
  ];
  assertEquals(canvas.pixels, expected);
});

Deno.test("Canvas toString", () => {
  const canvas = new Canvas(7, 4, ".");
  const sprite = [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ];
  canvas.drawSprite(sprite, 2, 1);
  const expected = `
.......
...#...
..###..
...#...`.trim();
  assertEquals(canvas.toString(), expected);
});

Deno.test("Canvas prepend", () => {
  const canvas = new Canvas(7, 4, ".");
  const sprite = [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ];
  canvas.drawSprite(sprite, 2, 1);
  canvas.prepend(4);
  const expected = [
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", "#", ".", ".", "."],
    [".", ".", "#", "#", "#", ".", "."],
    [".", ".", ".", "#", ".", ".", "."],
  ];
  assertEquals(canvas.pixels, expected);
});

Deno.test("Canvas trim", () => {
  const canvas = new Canvas(7, 4, ".");
  const sprite = [
    [".", "#", "."],
    ["#", "#", "#"],
    [".", "#", "."],
  ];
  canvas.drawSprite(sprite, 2, 1);
  canvas.prepend(4);
  const expected = [
    [".", ".", ".", "#", ".", ".", "."],
    [".", ".", "#", "#", "#", ".", "."],
    [".", ".", ".", "#", ".", ".", "."],
  ];
  canvas.trim();
  assertEquals(canvas.pixels, expected);
});

Deno.test("Canvas can draw", () => {
  const canvas = new Canvas(2, 2, ".");

  canvas.drawSprite([["#"]], 0, 0);
  canvas.drawSprite([["#", "#"]], 0, 1);
  const sprite = [[".", "@"]];

  assertEquals(canvas.canDraw(sprite, 0, 0), true);
  assertEquals(canvas.canDraw(sprite, 0, 2), false);
});
