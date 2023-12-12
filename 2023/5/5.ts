const file = Bun.file('5/file.txt');

enum DestinationName {
  seed = 'seed',
  soil = 'soil',
  fertilizer = 'fertilizer',
  water = 'water',
  light = 'light',
  temperature = 'temperature',
  humidity = 'humidity',
  location = 'location',
}

const createMaps = () => {
  const mainMap = new Map<string, Map<number, number>>();

  const destinationKeys = Object.keys(DestinationName);

  destinationKeys.forEach((key, index) => {
    if (index === destinationKeys.length - 1) {
      return;
    }

    mainMap.set(
      `${key}-to-${destinationKeys[index + 1]}`,
      new Map<number, number>()
    );
  });

  return mainMap;
};

const firstStar = async () => {
  const mainMap = createMaps();

  const text = await file.text();

  const lines = new Array().concat(
    ...text
      .replaceAll(' map:', '')
      .replaceAll('seeds: ', 'seeds\n')
      .split('\n\n')
      .map((text) => text.split('\n'))
  );

  let lastSection = 'seeds';

  const seeds: number[] = [];

  let helperLocations: number[] = [];

  lines.forEach((line) => {
    const isNumericLine = line.includes(' ');

    const currentMap = mainMap.get(lastSection)!;

    if (isNumericLine && lastSection === 'seeds') {
      seeds.push(...line.split(' ').map((num: string) => parseInt(num)));
      helperLocations = [...seeds];
    } else if (isNumericLine) {
      const [destinationStart, sourceStart, rangeLength] = line
        .split(' ')
        .map((num: string) => parseInt(num));

      helperLocations.forEach((location) => {
        if (sourceStart <= location && location < sourceStart + rangeLength) {
          const destinationLocation =
            destinationStart + (location - sourceStart);
          currentMap.set(location, destinationLocation);
        }
      });
    } else if (!isNumericLine) {
      if (lastSection !== 'seeds') {
        helperLocations.forEach((location) => {
          if (!currentMap.has(location)) {
            currentMap.set(location, location);
          }
        });

        helperLocations = Array.from(currentMap.values());
      }

      lastSection = line;
    }
  });

  const mapKeys = Array.from(mainMap.keys());
  let lowestLocation: number | undefined = undefined;

  seeds.forEach((seed) => {
    let currentPosition = seed;

    mapKeys.forEach((key) => {
      const map = mainMap.get(key)!;
      currentPosition = map.get(currentPosition) ?? currentPosition;
    });

    if (lowestLocation === undefined || currentPosition < lowestLocation) {
      lowestLocation = currentPosition;
    }
  });

  console.log('firstStar:', lowestLocation);
};

interface LocationRange {
  sourceStart: number;
  destinationStart: number;
  rangeLength: number;
}

const secondStar = async () => {
  const text = await file.text();

  const lines = new Array().concat(
    ...text
      .replaceAll(' map:', '')
      .replaceAll('seeds: ', 'seeds\n')
      .split('\n\n')
      .map((text) => text.split('\n'))
  );

  const destinationKeys = Object.keys(DestinationName).reverse();

  const mappings: Record<string, LocationRange[]> = {};

  destinationKeys.forEach((key, index) => {
    if (index === destinationKeys.length - 1) {
      return;
    }

    mappings[key] = [];
  });

  const seeds: { start: number; range: number }[] = [];

  let currentKey = destinationKeys[0];
  lines.reverse().forEach((line) => {
    const isNumericLine = line.includes(' ');

    if (!isNumericLine) {
      currentKey = destinationKeys[destinationKeys.indexOf(currentKey) + 1];

      if (currentKey === 'seed') {
        return;
      }
    } else if (isNumericLine) {
      if (currentKey === 'seed') {
        line.split(' ').forEach((num: string, index: number) => {
          if (index % 2 === 0) {
            seeds.push({ start: parseInt(num), range: 1 });
          } else {
            seeds[seeds.length - 1].range = parseInt(num);
          }
        });

        return;
      }

      const [sourceStart, destinationStart, rangeLength] = line
        .split(' ')
        .map((num: string) => parseInt(num));

      mappings[currentKey].push({
        destinationStart,
        sourceStart,
        rangeLength,
      });
    }
  });

  for (let location = 1; location < 100000000; location++) {
    let currentValue = location;
    Object.entries(mappings).forEach(([key, ranges]) => {
      const range = ranges.find((range) => {
        const isInRange =
          range.sourceStart <= currentValue &&
          currentValue < range.sourceStart + range.rangeLength;

        return isInRange;
      });

      if (range) {
        const difference = range.sourceStart - range.destinationStart;

        currentValue = difference > 0 ? currentValue - difference : currentValue + Math.abs(difference);
        return true;
      }
    });

    const isASeed = seeds.some(({ start, range }) => {
      return start <= currentValue && currentValue < start + range;
    });

    if (isASeed) {
      console.log('secondStar:', location);
      break;
    }
  }
};

firstStar();
secondStar();
