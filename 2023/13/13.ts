const file = Bun.file('13/file.txt');

const getMaps = (text: string): string[][] => {
  const maps: string[][] = [];
  text.split('\n\n').forEach((line) => {
    maps.push(line.split('\n'));
  });
  return maps;
};

const equalWithSmudge = (line1: string, line2: string): boolean => {
  for (let i = 0; i < line1.length; i++) {
    let helper1 = [...line1];
    let helper2 = [...line2];

    helper1[i] = helper1[i] === '#' ? '.' : '#';
    if (helper1.join('') === line2) {
      return true;
    }

    helper2[i] = helper2[i] === '#' ? '.' : '#';
    if (helper2.join('') === line1) {
      return true;
    }
  }

  return false;
};

const calculateReflection = (
  map: string[],
  withSmudge = false
): number | null => {
  for (let i = 0; i < map.length - 1; i++) {
    let matching = true;

    let leftIndex = i;
    let rightIndex = i + 1;
    let smudge = 0;

    while (leftIndex >= 0 && rightIndex < map.length) {
      if (map[leftIndex] !== map[rightIndex]) {
        if (
          withSmudge &&
          smudge === 0 &&
          equalWithSmudge(map[leftIndex], map[rightIndex])
        ) {
          smudge++;
        } else {
          matching = false;
          break;
        }
      }

      leftIndex--;
      rightIndex++;
    }

    if (withSmudge && smudge === 0) {
      continue;
    }

    if (matching) {
      return i;
    }
  }

  return null;
};

const getReflectionLine = (
  map: string[],
  withSmudge = false
): { type: 'vertical' | 'horizontal'; index: number } | 0 => {
  const horizontalReflection = calculateReflection(map,withSmudge);

  if (horizontalReflection !== null) {
    return { type: 'horizontal', index: horizontalReflection };
  }

  let verticalMap = [];

  for (let lineIndex = 0; lineIndex < map[0].length; lineIndex++) {
    let line = '';
    for (let index = 0; index < map.length; index++) {
      line += map[index][lineIndex];
    }
    verticalMap.push(line);
  }

  const verticalReflection = calculateReflection(verticalMap, withSmudge);

  if (verticalReflection !== null) {
    return { type: 'vertical', index: verticalReflection };
  }

  return 0;
};

const firstStar = async () => {
  const text = await file.text();

  let sum = 0;

  getMaps(text).forEach((map) => {
    const result = getReflectionLine(map);

    if (result === 0) {
      return;
    }

    if (result.type === 'horizontal') {
      sum += (result.index + 1) * 100;
    } else {
      sum += result.index + 1;
    }
  });

  console.log('firstStar:', sum);
};

const secondStar = async () => {
  const text = await file.text();

  let sum = 0;

  getMaps(text).forEach((map) => {
    const result = getReflectionLine(map, true);

    if (result === 0) {
      return;
    }

    if (result.type === 'horizontal') {
      sum += (result.index + 1) * 100;
    } else {
      sum += result.index + 1;
    }
  });

  console.log('secondStar:', sum);
};

firstStar();
secondStar();
