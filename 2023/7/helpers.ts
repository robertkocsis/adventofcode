export type Hand =
  | 'A'
  | 'K'
  | 'Q'
  | 'J'
  | 'T'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'
  | '2';

export const getCardPoints = (card: Hand, joker: boolean) => {
  switch (card) {
    case 'A':
      return 14;
    case 'K':
      return 13;
    case 'Q':
      return 12;
    case 'J':
      return joker ? 1 : 11;
    case 'T':
      return 10;
    default:
      return parseInt(card);
  }
};

const getHandPoints = (hand: Hand[]) => {
  const map = new Map<Hand, number>();

  hand.forEach((card) => {
    map.set(card, (map.get(card) || 0) + 1);
  });

  const values = Array.from(map.values());

  // five of a kind
  if (values.includes(5)) {
    return 6;
  }

  // four of a kind
  if (values.includes(4)) {
    return 5;
  }

  // full house
  if (values.includes(3) && values.includes(2)) {
    return 4;
  }

  // three of a kind
  if (values.includes(3)) {
    return 3;
  }

  // two pairs
  if (values.filter((value) => value === 2).length === 2) {
    return 2;
  }

  // one pair
  if (values.includes(2) && !values.includes(3)) {
    return 1;
  }

  return 0;
};

const calculatePoints = (hand: Hand[], joker: boolean) => {
  if (joker) {
    const map = new Map<Hand, number>();
    hand.forEach((card) => {
      map.set(card, (map.get(card) || 0) + 1);
    });

    const mostCommonCards = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .filter(([key, value]) => key !== 'J');

    if (mostCommonCards.length === 0) {
      return getHandPoints(hand);
    }

    const mostCommonCard = mostCommonCards[0][0];

    return getHandPoints(
      hand.map((card) => (card === 'J' ? mostCommonCard : card))
    );
  }

  return getHandPoints(hand);
};

export const compareHands = (a: Hand[], b: Hand[], joker: boolean) => {
  const aPoints = calculatePoints(a, joker);
  const bPoints = calculatePoints(b, joker);

  if (aPoints > bPoints) {
    return 1;
  } else if (aPoints < bPoints) {
    return -1;
  }

  return compareCards(a, b, joker);
};

const compareCards = (a: Hand[], b: Hand[], joker: boolean) => {
  for (let i = 0; i < 5; i++) {
    const aPoints = getCardPoints(a[i], joker);
    const bPoints = getCardPoints(b[i], joker);

    if (aPoints > bPoints) {
      return 1;
    } else if (aPoints < bPoints) {
      return -1;
    }
  }

  return 0;
};
