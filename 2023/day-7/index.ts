const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

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
  const map: { [key: string]: number } = {};
  for (const card of hand) {
    map[card] = (map[card] || 0) + 1;
  }
  const counts = Object.values(map).sort((a, b) => b - a);

  if (counts[0] === 5) {
    return 6; // five of a kind
  }
  if (counts[0] === 4) {
    return 5; // four of a kind
  }
  if (counts[0] === 3 && counts[1] === 2) {
    return 4; // full house
  }
  if (counts[0] === 3 && counts[1] === 1) {
    return 3; // three of a kind
  }
  if (counts[0] === 2 && counts[1] === 2) {
    return 2; // two pair
  }
  if (counts[0] === 2 && counts[1] === 1) {
    return 1; // one pair
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
  const hands: Array<[string, number]> = str.trim().split("\n").map((line) => {
    const [hand, bet] = line.trim().split(/\s+/);
    return [hand, Number(bet)];
  });
  hands.sort(rankSorter);
  const sum = hands.reduce((acc, [_, bet], i) => acc + (bet * (i + 1)), 0);
  return sum;
}

if (!Deno.env.get("TESTING")) {
  console.log(part1(input));
}
