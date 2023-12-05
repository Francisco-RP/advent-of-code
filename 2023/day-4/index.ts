const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  input = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`.trim();
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

/***********************************************************************
 * Part 1
 */

export function part1(str: string): number {
  const cards = str.trim().split(`\n`).map((card) => card.split(":")[1].trim());
  let points = 0;

  cards.forEach((card) => {
    const [win, mine] = card.split(" | ").map((side) => side.split(/\s+/));
    let p = 1;
    let inner = 0;
    mine.forEach((num) => {
      if (win.includes(num)) {
        if (p === 1) {
          inner += p;
          p = 2;
        } else {
          inner *= 2;
        }
      }
    });
    points += inner;
  });

  return points;
}

/***********************************************************************
 * Part 2
 */

export function part2(str: string): number {
  const cards = str.trim().split(`\n`).reduce((map, card, i) => {
    const c = card.split(":")[1].trim();
    map.set(i, [c]);
    return map;
  }, new Map());

  const len = Array.from(cards).length;

  for (let i = 0; i < len; i++) {
    const subCards = cards.get(i);
    subCards.forEach((sub: string) => {
      const [win, mine] = sub.split(" | ").map((side: string) =>
        side.split(/\s+/)
      );
      const total = mine.filter((m: string) => win.includes(m)).length;
      for (let n = i + total; n > i; n--) {
        const group = cards.get(n);
        group.push(group[0]);
      }
    });
  }
  // console.log(cards);
  return Array.from(cards.values()).flat().length;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
  console.log(part2(input));
}
