import { check } from './helper';

const file = await Bun.file('24/file.txt').text();


interface Stone {
  x: number;
  y: number;
  z: number;
  xVel: number;
  yVel: number;
  zVel: number;
}

const getHailStones = (file: string) => {
  const stones: Stone[] = [];
  file.split('\n').forEach((line) => {
    const [x, y, z, xVel, yVel, zVel] = line
      .split('@')
      .map((n) => {
        return n.split(', ').map((n) => parseInt(n));
      })
      .flat();
    stones.push({ x, y, z, xVel, yVel, zVel });
  });
  return stones;
};

const firstStar = () => {
  const stones = getHailStones(file);
  const area = [200000000000000, 400000000000000];

  let intersections = 0;

  stones.forEach((a, i) => {
    stones.forEach((b, j) => {
      const helpera = [...Object.values(a).map((value) => parseInt(value))];
      const helperB = [...Object.values(b).map((value) => parseInt(value))];
      if (i !== j && j > i && check(helpera, helperB, area[0], area[1])) {
        intersections++;
      }
    });
  });
  console.log('firstStar', intersections);
};

firstStar();
