import { get } from "http";

const firstFile = Bun.file('8/firstFile.txt');
const secondFile = Bun.file('8/secondFile.txt');

const createMap = (lines: string[]) => {
  const map = new Map<string, { L: string; R: string }>();

  lines.forEach((line, index) => {
    if (index === 0) {
      return;
    }

    const [name, sides] = line.split(' = ');

    const [L, R] = sides.replaceAll('(', '').replaceAll(')', '').split(', ');

    map.set(name, { L, R });
  });

  return map;
};

const firstStar = async () => {
  const text = await firstFile.text();

  const lines = text.split('\n').filter((line) => !!line);
  const map = createMap(lines);

  const steps: string[] = lines[0]
    .split('')
    .filter((step) => (!!step && step === 'L') || step === 'R');

  let counter = 0;
  let current = 'AAA';
  const end = 'ZZZ';
  while (current !== end) {
    steps.forEach((step) => {
      if (current === end) {
        return;
      }

      counter += 1;

      const { L, R } = map.get(current)!;

      if (step === 'L') {
        current = L;
      }

      if (step === 'R') {
        current = R;
      }
    });
  }

  console.log('firstStar', counter);
};

const getDistanceToEnd = (
  node: string,
  map: Map<string, { L: string; R: string }>,
  steps: string[]
) => {
  let distance = 0;
  let current = node;
  while (current[2] !== 'Z') {
    steps.forEach((step) => {
      if (current[2] === 'Z') {
        return;
      }

      const { L, R } = map.get(current)!;

      current = step === 'L' ? L : R;

      distance += 1;
    });
  }

  return distance;
};

const calculateLCM = (numbers: number[]): number => {
  const gcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  };

  const lcmOfTwo = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
  };

  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    result = lcmOfTwo(result, numbers[i]);
  }

  return result;
};

const secondStar = async () => {
  const text = await secondFile.text();

  const lines = text.split('\n').filter((line) => !!line);
  const map = createMap(lines);

  const steps: string[] = lines[0]
    .split('')
    .filter((step) => (!!step && step === 'L') || step === 'R');

  let counter = 0;
  const currentNodes: string[] = Array.from(map.keys()).filter(
    (key: string) => key[2] === 'A'
  );

  const distances = currentNodes.map((node) => getDistanceToEnd(node, map, steps));

  console.log('secondStar', calculateLCM(distances));
};

firstStar();
secondStar();
