const file = Bun.file('9/file.txt');

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

const getExtrapolatedValueBackwards = (numbers: number[]): number => {
  const differences = getDifferences(numbers);

  if (
    differences.filter((difference) => difference === 0).length ===
    differences.length
  ) {
    return numbers[0];
  }

  return numbers[0] - getExtrapolatedValueBackwards(differences);
};

const firstStar = async () => {
  const lines = (await file.text())
    .split('\n')
    .filter((line) => !!line)
    .map((line) => line.split(' ').map((num) => parseInt(num)));

  let sum = 0;

  lines.forEach((line) => {
    sum += getExtrapolatedValue(line);
  });

  console.log('firstStar', sum);
};

const secondStar = async () => {
  const lines = (await file.text())
    .split('\n')
    .filter((line) => !!line)
    .map((line) => line.split(' ').map((num) => parseInt(num)));

  let sum = 0;

  lines.forEach((line) => {
    sum += getExtrapolatedValueBackwards(line);
  });

  console.log('secondStar', sum);
};

firstStar();
secondStar();
