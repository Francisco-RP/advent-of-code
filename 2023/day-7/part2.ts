const __dirname = new URL(".", import.meta.url).pathname;

let input: string;
if (Deno.env.get("DEBUGGING")) {
  // change the input specifically for debugging
  input = "";
} else {
  input = await Deno.readTextFile(__dirname + "/input.txt");
}

const camelCards = [
  "J", // now the weakest card but is a wild card
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
];

/**
 * Rank: Hands
 * 6: Five of a kind = 6
 * 5: Four of a kind = 5
 * 4: Full house = 4  (three of a kind + one pair)
 * 3: Three of a kind = 3
 * 2: Two pair = 2
 * 1: One pair = 1
 * 0: High card = 0 (no pairs)
 */
function getScore(hand: string): number {
  let wilds = 0;
  const map: { [key: string]: number } = {};
  for (const card of hand) {
    if (card === "J") {
      wilds++;
      continue;
    }
    map[card] = (map[card] || 0) + 1;
  }
  const counts = Object.values(map).sort((a, b) => b - a);

  // distribute wilds to create the best hand
  let i = 0;
  while (wilds > 0 && i < counts.length) {
    const count = counts[i];
    if (count < 4) {
      counts[i] += 1;
      wilds -= 1;
    } else {
      i++;
    }
  }

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

function compareSameScore(a: string, b: string): number {
  for (let i = 0; i < 5; i++) {
    const aCard = a[i];
    const bCard = b[i];
    const aIndex = camelCards.indexOf(aCard);
    const bIndex = camelCards.indexOf(bCard);
    if (aIndex > bIndex) {
      return 1; // sort a after b
    } else if (aIndex < bIndex) {
      return -1; // sort a before b
    }
  }
  return 0;
}

function rankSorter(
  [aHand]: [string, number],
  [bHand]: [string, number],
): number {
  const aScore = getScore(aHand);
  const bScore = getScore(bHand);
  if (aScore !== bScore) {
    return aScore - bScore; // sort from low to highest rank
  } else {
    // same rank, so we need to compare the cards
    return compareSameScore(aHand, bHand);
  }
}

export function part2(str: string): number {
  const hands: Array<[string, number]> = str.trim().split("\n").map((line) => {
    const [hand, bet] = line.trim().split(/\s+/);
    return [hand, Number(bet)];
  });
  hands.sort(rankSorter);
  const sum = hands.reduce((acc, [_, bet], i) => acc + (bet * (i + 1)), 0);
  return sum;
}

if (!Deno.env.get("TESTING")) {
  console.log(part2(input));
}
