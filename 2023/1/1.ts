const file = Bun.file('1/file.txt');

const firstStar = async () => {
  let sum = 0;

  const lines = (await file.text()).split('\n');

  lines.forEach((line) => {
    const firstNumber = line
      .trim()
      .split('')
      .find((char) => isNaN(parseInt(char)) === false);
    const secondNumber = line
      .trim()
      .split('')
      .reverse()
      .find((char) => isNaN(parseInt(char)) === false);
    if (firstNumber && secondNumber) {
      sum += parseInt(firstNumber + secondNumber);
    }
  });

  console.log('firstStar:', sum);
};

const secondStar = async () => {
  const numbersWithThreeLetters = [
    { value: 1, label: 'one' },
    { value: 2, label: 'two' },
    { value: 6, label: 'six' },
  ];
  const numbersWithFourLetters = [
    { value: 4, label: 'four' },
    { value: 5, label: 'five' },
    { value: 9, label: 'nine' },
  ];
  const numbersWithFiveLetters = [
    { value: 3, label: 'three' },
    { value: 7, label: 'seven' },
    { value: 8, label: 'eight' },
  ];

  let sum = 0;

  const lines = (await file.text()).split('\n');

  lines.forEach((line) => {
    const characters = line.trim().split('');
    const charactersLength = characters.length;
    let firstNumber = '';
    let lastNumber = '';

    characters.forEach((char, index) => {
      if (isNaN(parseInt(char)) === false) {
        if (firstNumber === '') {
          firstNumber = char;
        }
        lastNumber = char;
      }

      if (index + 2 <= charactersLength) {
        const word =
          characters[index] + characters[index + 1] + characters[index + 2];
        if (
          numbersWithThreeLetters.map((value) => value.label).includes(word)
        ) {
          if (firstNumber === '') {
            firstNumber = numbersWithThreeLetters
              .find((value) => value.label === word)!
              .value.toString();
          } else {
            lastNumber = numbersWithThreeLetters
              .find((value) => value.label === word)!
              .value.toString();
          }
        }
      }

      if (index + 3 <= charactersLength) {
        const word =
          characters[index] +
          characters[index + 1] +
          characters[index + 2] +
          characters[index + 3];
        if (numbersWithFourLetters.map((value) => value.label).includes(word)) {
          if (firstNumber === '') {
            firstNumber = numbersWithFourLetters
              .find((value) => value.label === word)!
              .value.toString();
          } else {
            lastNumber = numbersWithFourLetters
              .find((value) => value.label === word)!
              .value.toString();
          }
        }
      }

      if (index + 4 <= charactersLength) {
        const word =
          characters[index] +
          characters[index + 1] +
          characters[index + 2] +
          characters[index + 3] +
          characters[index + 4];
        if (numbersWithFiveLetters.map((value) => value.label).includes(word)) {
          if (firstNumber === '') {
            firstNumber = numbersWithFiveLetters
              .find((value) => value.label === word)!
              .value.toString();
          } else {
            lastNumber = numbersWithFiveLetters
              .find((value) => value.label === word)!
              .value.toString();
          }
        }
      }
    });

    sum += parseInt(firstNumber + lastNumber);
  });

  console.log('secondStart:', sum);
};

firstStar();
secondStar();
