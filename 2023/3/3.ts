import { get } from 'http';

const file = Bun.file('3/file.txt');

type NumLocation = {
  rowIndex: number;
  startIndex: number;
  endIndex: number;
  value: string;
};

const getAdjacentLocations = (
  numLocation: NumLocation,
  xLength: number,
  yLength: number
) => {
  const adjacentLocations: { row: number; col: number }[] = [];

  const adjacentStartIndex =
    numLocation.startIndex - 1 >= 0 ? numLocation.startIndex - 1 : 0;
  const adjacentEndIndex =
    numLocation.endIndex + 1 <= xLength ? numLocation.endIndex + 1 : xLength;

  if (numLocation.rowIndex > 0) {
    for (let i = adjacentStartIndex; i <= adjacentEndIndex; i++) {
      adjacentLocations.push({ row: numLocation.rowIndex - 1, col: i });
    }
  }

  if (numLocation.rowIndex < yLength) {
    for (let i = adjacentStartIndex; i <= adjacentEndIndex; i++) {
      adjacentLocations.push({ row: numLocation.rowIndex + 1, col: i });
    }
  }

  if (numLocation.startIndex !== adjacentStartIndex) {
    adjacentLocations.push({
      row: numLocation.rowIndex,
      col: adjacentStartIndex,
    });
  }

  if (numLocation.endIndex !== adjacentEndIndex) {
    adjacentLocations.push({
      row: numLocation.rowIndex,
      col: adjacentEndIndex,
    });
  }

  return adjacentLocations;
};

const getNumbersFromSchematic = (schematic: string[][]) => {
  const numLocations: NumLocation[] = [];

  schematic.forEach((row, rowIndex) => {
    let currentNumber: NumLocation | undefined = undefined;

    row.forEach((char, charIndex) => {
      if (isNaN(parseInt(char))) {
        if (currentNumber) {
          numLocations.push(currentNumber);
          currentNumber = undefined;
        }
      } else {
        if (!currentNumber) {
          currentNumber = {
            rowIndex,
            startIndex: charIndex,
            endIndex: charIndex,
            value: char,
          };
        } else {
          currentNumber.endIndex = charIndex;
          currentNumber.value += char;
        }
      }
    });

    if (currentNumber) {
      numLocations.push(currentNumber);
    }
  });

  return numLocations;
};

const numLocationHasAdjacentSymbol = (
  numLocation: NumLocation,
  schematic: string[][]
) => {
  const adjacentLocations = getAdjacentLocations(
    numLocation,
    schematic[0].length - 1,
    schematic.length - 1
  );

  let adjacentSymbol = false;
  adjacentLocations.every((location) => {
    if (
      schematic[location.row][location.col] !== '.' &&
      isNaN(parseInt(schematic[location.row][location.col]))
    ) {
      adjacentSymbol = true;
      return false;
    }

    return true;
  });

  return adjacentSymbol;
};

const firstStar = async () => {
  const schematic = (await file.text())
    .split('\n')
    .map((line) => line.split(''));

  const numLocations: NumLocation[] = getNumbersFromSchematic(schematic);

  const result = numLocations
    .filter((numLocation) => {
      return numLocationHasAdjacentSymbol(numLocation, schematic);
    })
    .map((numLocation) => {
      return {
        ...numLocation,
        value: parseInt(numLocation.value),
      };
    })
    .reduce((acc, currentValue) => acc + currentValue.value, 0);

  console.log('firstStar:', result);
};

const secondStar = async () => {
  const schematic = (await file.text())
    .split('\n')
    .map((line) => line.split(''));

  const locationNumLocationMap = new Map<string, NumLocation>();

  getNumbersFromSchematic(schematic).forEach((numLocation) => {
    for (let i = numLocation.startIndex; i <= numLocation.endIndex; i++) {
      locationNumLocationMap.set(
        JSON.stringify({ row: numLocation.rowIndex, col: i }),
        numLocation
      );
    }
  });

  const gearLocations = schematic
    .map((row, rowIndex) => {
      return row.map((char, charIndex) => {
        if (char === '*') {
          return {
            row: rowIndex,
            col: charIndex,
          };
        }
      });
    })
    .flat()
    .filter((gear) => gear !== undefined) as { row: number; col: number }[];

  let sum = 0;

  gearLocations.forEach((gearLocation) => {
    const adjacentLocations = getAdjacentLocations(
      {
        rowIndex: gearLocation.row,
        startIndex: gearLocation.col,
        endIndex: gearLocation.col,
        value: '*',
      },
      schematic[0].length - 1,
      schematic.length - 1
    );

    const adjacentNumLocations = new Set<NumLocation>();

    adjacentLocations.forEach((location) => {
      const numLocation = locationNumLocationMap.get(JSON.stringify(location));

      if (numLocation) {
        adjacentNumLocations.add(numLocation);
      }
    });

    if (adjacentNumLocations.size === 2) {
      const numbers = Array.from(adjacentNumLocations).map((numLocation) =>
        parseInt(numLocation.value)
      );
      sum += numbers[0] * numbers[1];
    }
  });

  console.log('secondStar:', sum);
};

firstStar();
secondStar();
