const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

input = input.trim();

/****************************************
 * Part 1
 */

const camelCards = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

/**
 * Rankings:
 * Five of a kind = 6
 * Four of a kind = 5
 * Full house = 4
 * Three of a kind = 3
 * Two pair = 2
 * One pair = 1
 * High card = 0
 */
function getRank(hand: string): number {
  const set = new Set(hand);
  if (set.size === 1) {
    return 6; // five of a kind
  }
  if (set.size === 2) {
    // example: AA8AA or 23332
    // can be either four of a kind or full house
    let max = 0;
    [...set].forEach((card) => {
      max = Math.max(max, hand.split("").filter((c) => c === card).length);
    });
    if (max === 4) {
      return 5; // four of a kind
    } else {
      return 4; // full house
    }
  }
  if (set.size === 3) {
    // example: 23432 or TTT98
    // can be either three of a kind or two pair
    let max = 0;
    [...set].forEach((card) => {
      max = Math.max(max, hand.split("").filter((c) => c === card).length);
    });
    if (max === 3) {
      return 3; // three of a kind
    } else {
      return 2; // two pair
    }
  }
  if (set.size === 4) {
    // example: A23A4
    return 1; // one pair
  }
  if (set.size === 5) {
    // example: 23456
    return 0; // high card
  }

  return 0;
}

function compareSameRank(a: string, b: string): number {
  for (let i = 0; i < 5; i++) {
    const aCard = a[i];
    const bCard = b[i];
    const aIndex = camelCards.indexOf(aCard);
    const bIndex = camelCards.indexOf(bCard);
    if (aIndex > bIndex) {
      return 1;
    } else if (aIndex < bIndex) {
      return -1;
    }
  }
  return 0;
}

function rankSorter(a: [string, number], b: [string, number]): number {
  const [aHand] = a;
  const [bHand] = b;
  const aRank = getRank(aHand);
  const bRank = getRank(bHand);
  if (aRank !== bRank) {
    return aRank - bRank; // sort from low to highest rank
  } else {
    // same rank, so we need to compare the cards
    return compareSameRank(aHand, bHand);
  }
}

export function part1(str: string): number {
  const hands: Array<[string, number]> = str.split("\n").map((line) => {
    const [hand, bet] = line.trim().split(/\s+/);
    return [hand, Number(bet)];
  });
  hands.sort(rankSorter);
  const sum = hands.reduce((acc, [_, bet], i) => acc + (bet * (i + 1)), 0);
  return sum;
}

/****************************************
 * Part 2
 */

export function part2(str: string): number {
  return 0;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
  console.log(part2(input));
}
