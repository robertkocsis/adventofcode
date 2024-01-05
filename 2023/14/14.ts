const file = Bun.file('14/file.txt');

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

const calculateLoad = (index: number, map: string[][]): number => {
  let load = 0;
  for (let i = map.length - 1 - index; i > -1; i--) {
    load++;

    if (map[i].filter((x) => x === '#').length === 0) {
      continue;
    }
  }

  return load;
};

const tilt = (map: string[][], direction: Direction): boolean => {
  let rocksMoved = false;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      let current = map[i][j];

      if (current !== 'O') {
        continue;
      }

      if (direction === Direction.Up && i > 0 && map[i - 1][j] === '.') {
        map[i - 1][j] = 'O';
        map[i][j] = '.';
        rocksMoved = true;
      }

      if (
        direction === Direction.Down &&
        i < map.length - 1 &&
        map[i + 1][j] === '.'
      ) {
        map[i + 1][j] = 'O';
        map[i][j] = '.';
        rocksMoved = true;
      }

      if (direction === Direction.Left && j > 0 && map[i][j - 1] === '.') {
        map[i][j - 1] = 'O';
        map[i][j] = '.';
        rocksMoved = true;
      }

      if (
        direction === Direction.Right &&
        j < map[i].length - 1 &&
        map[i][j + 1] === '.'
      ) {
        map[i][j + 1] = 'O';
        map[i][j] = '.';
        rocksMoved = true;
      }
    }
  }

  return rocksMoved;
};

const readMap = (text: string): string[][] => {
  const map: string[][] = [];
  text.split('\n').forEach((line) => {
    map.push(line.split(''));
  });
  return map;
};

const firstStar = async () => {
  const text = await file.text();

  const map = readMap(text);

  let rocksMoved = true;
  while (rocksMoved) {
    rocksMoved = tilt(map, Direction.Up);
  }

  let load = 0;

  for (let i = 0; i < map.length; i++) {
    let lineLoad = calculateLoad(i, map);
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 'O') {
        load += lineLoad;
      }
    }
  }

  console.log('firstStar:', load);
};

const secondStar = async () => {
  const text = await file.text();
  const helperMap = new Map<string, number>();

  let map = readMap(text);

  helperMap.set(JSON.stringify(map), 0);

  const runCycle = () => {
    while (tilt(map, Direction.Up)) {}
    while (tilt(map, Direction.Left)) {}
    while (tilt(map, Direction.Down)) {}
    while (tilt(map, Direction.Right)) {}
  };

  let cycleStart = 0;
  let cycleEnd = 0;

  for (let i = 1; i <= 1000000000; i++) {
    runCycle();
    const mapString = JSON.stringify(map);
    if (helperMap.has(mapString)) {
      cycleStart = helperMap.get(mapString)!;
      cycleEnd = i;
      break;
    } else {
      helperMap.set(mapString, i);
    }
  }

  const cycleLength = cycleEnd - cycleStart;
  const remainingCycles = 1000000000 - cycleEnd;
  const remainingCyclesInCycle = remainingCycles % cycleLength;

  for (let i = 0; i < remainingCyclesInCycle; i++) {
    runCycle();
  }

  let load = 0;

  for (let i = 0; i < map.length; i++) {
    let lineLoad = calculateLoad(i, map);
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 'O') {
        load += lineLoad;
      }
    }
  }

  console.log('secondStar:', load);
};

firstStar();
secondStar();
