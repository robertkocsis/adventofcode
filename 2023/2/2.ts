const file = Bun.file('2/file.txt');

const firstStar = async () => {
  let sum = 0;

  const lines = (await file.text()).split('\n');

  lines.forEach((line) => {
    const gameId = line
      .split(':')[0]
      .split('')
      .filter((char) => !isNaN(parseInt(char)))
      .join('');

    const redCubeAmount = 12;
    const greenCubeAmount = 13;
    const blueCubeAmount = 14;

    const sets = line.split(':')[1].trim().split(';');

    let gamePossible = true;

    sets.forEach((set) => {
      const cubes = set.split(',');

      cubes.forEach((cube) => {
        const number = cube.trim().split(' ')[0];
        const color = cube.trim().split(' ')[1];

        if (color === 'red' && parseInt(number) > redCubeAmount) {
          gamePossible = false;
        }
        if (color === 'green' && parseInt(number) > greenCubeAmount) {
          gamePossible = false;
        }
        if (color === 'blue' && parseInt(number) > blueCubeAmount) {
          gamePossible = false;
        }
      });
    });

    if (gamePossible) {
      sum += parseInt(gameId);
    }
  });

  console.log('firstStar:', sum);
};

const secondStar = async () => {
  let sum = 0;

  const lines = (await file.text()).split('\n');

  lines.forEach((line) => {
    let minRedCubeAmount = 0;
    let minGreenCubeAmount = 0;
    let minBlueCubeAmount = 0;

    const sets = line.split(':')[1].trim().split(';');

    sets.forEach((set) => {
      const cubes = set.split(',');

      cubes.forEach((cube) => {
        const number = cube.trim().split(' ')[0];
        const color = cube.trim().split(' ')[1];

        if (color === 'red' && parseInt(number) > minRedCubeAmount) {
          minRedCubeAmount = parseInt(number);
        }
        if (color === 'green' && parseInt(number) > minGreenCubeAmount) {
          minGreenCubeAmount = parseInt(number);
        }
        if (color === 'blue' && parseInt(number) > minBlueCubeAmount) {
          minBlueCubeAmount = parseInt(number);
        }
      });
    });

    sum += minRedCubeAmount * minGreenCubeAmount * minBlueCubeAmount;
  });

  console.log('secondStar:', sum);
};

firstStar();
secondStar();
