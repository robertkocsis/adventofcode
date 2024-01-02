const file = Bun.file('11/file.txt');

interface Point {
  x: number;
  y: number;
}

type Extension = { x: number; amount: number } | { y: number; amount: number };

const addExtensions = (point: Point, extensions: Extension[]) => {
  let result = point;

  let xToAdd = 0;
  let yToAdd = 0;
  extensions.forEach((extension) => {
    if ('x' in extension) {
      if (result.x > extension.x) {
        xToAdd += extension.amount;
      }
    } else {
      if (result.y > extension.y) {
        yToAdd += extension.amount;
      }
    }
  });

  result = { x: result.x + xToAdd, y: result.y + yToAdd };

  return result;
};

const getExtensions = (map: string[], amount = 1): Extension[] => {
  const result: Extension[] = [];

  map.forEach((row, x) => {
    if (row.replaceAll('.', '').length === 0) {
      result.push({ x, amount: amount });
    }
  });

  for (let i = 0; i < map[0].length; i++) {
    if (map.filter((r) => r[i] !== '.').length === 0) {
      result.push({ y: i, amount });
    }
  }

  return result;
};

const getGalaxies = (map: string[]): Point[] => {
  const galaxies: Point[] = [];
  map.forEach((row, x) => {
    if (row.includes('#')) {
      row.split('').forEach((col, y) => {
        if (col === '#') {
          galaxies.push({ x, y });
        }
      });
    }
  });

  return galaxies;
};

const getDistance = (a: Point, b: Point) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const firstStar = async () => {
  const lines = (await file.text()).split('\n');
  const extensions = getExtensions(lines);
  const galaxies = getGalaxies(lines).map((g) => addExtensions(g, extensions));

  let sum = 0;

  for (let i = 0; i < galaxies.length; i++) {
    const galaxy = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const otherGalaxy = galaxies[j];
      sum += getDistance(galaxy, otherGalaxy);
    }
  }

  console.log('firstStar', sum);
};

const secondStar = async () => {
  const lines = (await file.text()).split('\n');
  const extensions = getExtensions(lines, 1000000 - 1);
  const galaxies = getGalaxies(lines).map((g) => addExtensions(g, extensions));

  let sum = 0;

  for (let i = 0; i < galaxies.length; i++) {
    const galaxy = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const otherGalaxy = galaxies[j];
      sum += getDistance(galaxy, otherGalaxy);
    }
  }

  console.log('secondStar', sum);
};

firstStar();
secondStar();
