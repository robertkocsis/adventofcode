const file = await Bun.file('21/file.txt').text();

const getNeighbors = (x: number, y: number) => {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
};

const firstStar = () => {
  const grid = file.split('\n').map((line) => line.split(''));
  let start = { x: 0, y: 0 };

  grid.forEach((line, x) => {
    line.forEach((cell, y) => {
      if (cell === 'S') {
        start = { x, y };
      }
    });
  });

  const stepMap = new Map<number, Set<string>>();

  stepMap.set(0, new Set([`${start.x},${start.y}`]));

  let lastStepSize = 0;
  for (let i = 0; i < 64; i++) {
    const currentSteps = stepMap.get(i);
    const nextSteps = new Set<string>();

    currentSteps!.forEach((step) => {
      const [x, y] = step.split(',').map((n) => parseInt(n));
      getNeighbors(x, y).forEach((neighbor) => {
        if (
          grid[neighbor.x] &&
          grid[neighbor.x][neighbor.y] &&
          grid[neighbor.x][neighbor.y] !== '#'
        ) {
          nextSteps.add(`${neighbor.x},${neighbor.y}`);
        }
      });
    });

    stepMap.set(i + 1, nextSteps);
    lastStepSize = nextSteps.size;
  }

  console.log('firstStar', lastStepSize);
};

const calculateValueFromNegative = (value: number, max: number): number => {
  if (value >= 0) {
    return value;
  }
  return calculateValueFromNegative(value + max + 1, max);
};

const calculateValueFromPositive = (value: number, max: number): number => {
  if (value <= max) {
    return value;
  }
  return calculateValueFromPositive(value - max - 1, max);
};

const calculateOriginalValue = (value: number, min = 0, max: number) => {
  if (value < min) {
    return calculateValueFromNegative(value, max);
  }
  return calculateValueFromPositive(value, max);
};

const getDifferences = (numbers: number[]) => {
  const differences: number[] = [];

  for (let i = 1; i < numbers.length; i++) {
    differences.push(numbers[i] - numbers[i - 1]);
  }

  return differences;
};

const getExtrapolatedValue = (numbers: number[]): number => {
  const differences = getDifferences(numbers);

  if (
    differences.filter((difference) => difference === 0).length ===
    differences.length
  ) {
    return numbers[numbers.length - 1];
  }

  return numbers[numbers.length - 1] + getExtrapolatedValue(differences);
};

const secondStar = () => {
  const grid = file.split('\n').map((line) => line.split(''));
  let start = { x: 0, y: 0 };

  grid.forEach((line, x) => {
    line.forEach((cell, y) => {
      if (cell === 'S') {
        start = { x, y };
      }
    });
  });

  const stepMap = new Map<number, Set<string>>();
  stepMap.set(0, new Set([`${start.x},${start.y}`]));

  const steps = [65, 65 + 131, 65 + 2 * 131, 65 + 3 * 131, 65 + 4 * 131];

  const polynomialValues: number[] = [];

  // this calculates the polynomal values
    for (let i = 0; i < steps[steps.length - 1]; i++) {
    const currentSteps = stepMap.get(i);

    if (steps.includes(i)) {
      polynomialValues.push(currentSteps?.size || 0);
    }

    const nextSteps = new Set<string>();

    currentSteps!.forEach((step) => {
      const [x, y] = step.split(',').map((n) => parseInt(n));
      getNeighbors(x, y).forEach((neighbor) => {
        const originalX = calculateOriginalValue(
          neighbor.x,
          0,
          grid.length - 1
        );
        const originalY = calculateOriginalValue(
          neighbor.y,
          0,
          grid[0].length - 1
        );
        if (
          grid[originalX] &&
          grid[originalX][originalY] &&
          grid[originalX][originalY] !== '#'
        ) {
          nextSteps.add(`${neighbor.x},${neighbor.y}`);
        }
      });
    });

    stepMap.set(i + 1, nextSteps);
  }

  for (let i = 0; i < 202297; i++) {
    polynomialValues.push(getExtrapolatedValue(polynomialValues));
    polynomialValues.shift();
  }


  console.log('secondStar', polynomialValues[polynomialValues.length - 1]);
};

firstStar();
secondStar();
