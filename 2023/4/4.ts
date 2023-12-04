const file = Bun.file('4/file.txt');

const getCardId = (line: string) => {
  return parseInt(
    line
      .split(':')[0]
      .split(' ')
      .filter((value) => !!value)[1]
  );
};

const getNumbers = (
  line: string
): { winningNumbers: number[]; cardNumbers: number[] } => {
  const arrays = line
    .split(':')[1]
    .split(' | ')
    .map((text) =>
      text
        .split(' ')
        .filter((text) => !!text)
        .map((num) => parseInt(num))
    );

  return { winningNumbers: arrays[0], cardNumbers: arrays[1] };
};

const getPoints = (
  matchedNumbers: number,
  map: Map<number, number>
): number => {
  if (map.has(matchedNumbers)) {
    return map.get(matchedNumbers) ?? 1;
  }

  return 2 * getPoints(matchedNumbers - 1, map);
};

const firstStar = async () => {
  const lines = (await file.text()).split('\n');
  const numberMap = new Map<number, number>();
  numberMap.set(1, 1);
  let sum = 0;

  lines.forEach((line) => {
    const cardId = getCardId(line);
    const numbers = getNumbers(line);

    let matchingNumbers = 0;

    numbers.winningNumbers.forEach((cardNumber) => {
      if (numbers.cardNumbers.includes(cardNumber)) {
        matchingNumbers++;
      }
    });

    if (matchingNumbers === 0) {
      return;
    }

    sum += getPoints(matchingNumbers, numberMap);
  });

  console.log('firstStar:', sum);
};

const secondStar = async () => {
  const lines = (await file.text()).split('\n');
  const numberMap = new Map<number, number>();

  const incrementNumberMap = (key: number, amount = 1) => {
    if (numberMap.has(key)) {
      numberMap.set(key, numberMap.get(key)! + amount);
    } else {
      numberMap.set(key, amount);
    }
  };

  lines.forEach((line) => {
    const cardId = getCardId(line);
    const numbers = getNumbers(line);

    incrementNumberMap(cardId);

    let matchingNumbers = 0;

    numbers.winningNumbers.forEach((cardNumber) => {
      if (numbers.cardNumbers.includes(cardNumber)) {
        matchingNumbers++;
      }
    });

    if (matchingNumbers > 0) {
      for (let i = 1; i <= matchingNumbers; i++) {
        incrementNumberMap(cardId + i, numberMap.get(cardId)!);
      }
    }
  });

  let sum = 0;
  numberMap.forEach((value) => {
    sum += value;
  });

  console.log('secondStar:', sum);
};

firstStar();
secondStar();
