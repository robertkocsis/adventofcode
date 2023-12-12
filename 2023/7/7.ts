import { Hand, compareHands } from './helpers';

const file = Bun.file('7/file.txt');

type Player = {
  hand: Hand[];
  bid: number;
};

const firstStar = async () => {
  const text = await file.text();

  const players: Player[] = text.split('\n').map((line) => {
    const [hand, bid] = line.split(' ');
    return { hand: hand.split('') as Hand[], bid: parseInt(bid) };
  });

  players.sort((a, b) => compareHands(a.hand, b.hand, false));

  console.log(
    'firstStar',
    players.reduce((acc, cur, index) => acc + cur.bid * (index + 1), 0)
  );
};

const secondStar = async () => {
  const text = await file.text();

  const players: Player[] = text.split('\n').map((line) => {
    const [hand, bid] = line.split(' ');
    return { hand: hand.split('') as Hand[], bid: parseInt(bid) };
  });

  players.sort((a, b) => compareHands(a.hand, b.hand, true));

  console.log(
    'secondStar',
    players.reduce((acc, cur, index) => acc + cur.bid * (index + 1), 0)
  );    
};

firstStar();
secondStar();
