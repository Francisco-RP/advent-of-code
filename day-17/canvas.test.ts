import { assertEquals } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Canvas, Sprite } from "./canvas.ts";

Deno.test("Canvas sets pixels correctly", () => {
  const canvas = new Canvas(7, 4, ".");
  // prettier-ignore
  const expected = [
    ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".",
  ];
  assertEquals(canvas.pixels, expected);
});

Deno.test({
  name: "Canvas places sprite fully within board",
  // only: true,
  fn() {
    const canvas = new Canvas(7, 4, ".");

    const sprite = new Sprite(3, 3);
    // prettier-ignore
    sprite.pixels = [
      ".", "#", ".",
      "#", "#", "#",
      ".", "#", ".",
    ];
    canvas.drawSprite(sprite, 2, 1);

    // prettier-ignore
    const expected = [
    ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", "#", ".", ".", ".",
    ".", ".", "#", "#", "#", ".", ".",
    ".", ".", ".", "#", ".", ".", ".",
  ];

    assertEquals(canvas.pixels, expected);
  },
});

Deno.test({
  name: "Canvas places sprite partial within board",
  // only: true,
  fn() {
    const canvas = new Canvas(7, 4, ".");

    const sprite = new Sprite(3, 3);
    // prettier-ignore
    sprite.pixels = [
      ".", "#", ".",
      "#", "#", "#",
      ".", "#", ".",
    ];

    canvas.drawSprite(sprite, 2, 3);
    // prettier-ignore
    const expected = [
    ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", ".", ".", ".", ".",
    ".", ".", ".", "#", ".", ".", ".",
  ];
    assertEquals(canvas.pixels, expected);
  },
});

Deno.test({
  name: "Canvas draw sprite doesnt overwrite board",
  // only: true,
  fn() {
    const canvas = new Canvas(7, 2, ".");

    const pixel = new Sprite(1, 1);
    pixel.pixels = ["#"];

    const sprite = new Sprite(2, 2);
    // prettier-ignore
    sprite.pixels = [
      ".", "#",
      ".", "#",
    ]

    canvas.drawSprite(pixel, 0, 0);
    canvas.drawSprite(pixel, 0, 1);
    canvas.drawSprite(pixel, 1, 1);
    canvas.drawSprite(sprite, 1, 0);

    // prettier-ignore
    const expected = [
      "#", ".", "#", ".", ".", ".", ".",
      "#", "#", "#", ".", ".", ".", ".",
    ];
    assertEquals(canvas.pixels, expected);
  },
});

Deno.test({
  name: "Canvas toString empty",
  // only: true,
  fn() {
    const canvas = new Canvas(7, 4, ".");
    const expected = `
.......
.......
.......
.......`.trim();
    assertEquals(canvas.toString(), expected);
  },
});

Deno.test({
  name: "Canvas toString with sprite",
  // only: true,
  fn() {
    const canvas = new Canvas(7, 4, ".");

    const sprite = new Sprite(3, 3);
    // prettier-ignore
    sprite.pixels = [
      ".", "#", ".",
      "#", "#", "#",
      ".", "#", ".",
    ];

    canvas.drawSprite(sprite, 2, 1);

    const expected = `
.......
...#...
..###..
...#...`.trim();
    assertEquals(canvas.toString(), expected);
  },
});

Deno.test({
  name: "Canvas prepend",
  // only: true,
  fn() {
    const canvas = new Canvas(7, 4, ".");

    const sprite = new Sprite(3, 3);
    // prettier-ignore
    sprite.pixels = [
      ".", "#", ".",
      "#", "#", "#",
      ".", "#", ".",
    ];

    canvas.drawSprite(sprite, 2, 1);

    canvas.prepend(4);

    // prettier-ignore
    const expected = [
      // prepend rows above original canvas
      ".", ".", ".", ".", ".", ".", ".",
      ".", ".", ".", ".", ".", ".", ".",
      ".", ".", ".", ".", ".", ".", ".",
      ".", ".", ".", ".", ".", ".", ".",
      // original canvas below
      ".", ".", ".", ".", ".", ".", ".",
      ".", ".", ".", "#", ".", ".", ".",
      ".", ".", "#", "#", "#", ".", ".",
      ".", ".", ".", "#", ".", ".", ".",
    ];
    assertEquals(canvas.pixels, expected);
    assertEquals(canvas.height, 8);
  },
});

Deno.test({
  name: "Canvas trim",
  // only: true,
  fn() {
    const canvas = new Canvas(7, 4, ".");

    const sprite = new Sprite(3, 3);
    // prettier-ignore
    sprite.pixels = [
      ".", "#", ".",
      "#", "#", "#",
      ".", "#", ".",
    ];

    canvas.drawSprite(sprite, 2, 1);
    canvas.prepend(4);

    // prettier-ignore
    const expected = [
      ".", ".", ".", "#", ".", ".", ".",
      ".", ".", "#", "#", "#", ".", ".",
      ".", ".", ".", "#", ".", ".", ".",
    ];
    canvas.trimStart();
    assertEquals(canvas.pixels, expected);
    assertEquals(canvas.height, 3);
  },
});

Deno.test({
  name: "Canvas can draw",
  // only: true,
  fn() {
    const canvas = new Canvas(2, 2, ".");

    const px1 = new Sprite(1, 1);
    px1.pixels = ["#"];

    const px2 = new Sprite(2, 1);
    px2.pixels = ["#", "#"];

    canvas.drawSprite(px1, 0, 0);
    canvas.drawSprite(px2, 0, 1);
    // console.log(canvas.toString());

    const sprite = new Sprite(2, 1);
    sprite.pixels = [".", "@"];

    assertEquals(canvas.canDraw(sprite, 0, 0), true, "allowed");
    assertEquals(canvas.canDraw(sprite, 0, 1), false, "blocked");
    assertEquals(canvas.canDraw(sprite, 0, 2), false, "out of range");
  },
});
