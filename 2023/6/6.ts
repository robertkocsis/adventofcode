const file = Bun.file('6/file.txt');

type Race = {
  distance: number;
  time: number;
};

type RaceStrategy = {
  time: number;
};

const getWaysToBeatRace = (race: Race) => {
  const results: RaceStrategy[] = [];
  for (let index = 0; index < race.time; index++) {
    const speedPerSecond = index;
    const timeLeft = race.time - index;

    if (speedPerSecond * timeLeft > race.distance) {
      results.push({ time: speedPerSecond });
    }
  }

  return results;
};

const firstStar = async () => {
  const text = await file.text();

  const races: Race[] = [];

  text
    .replaceAll('Time:', '')
    .replaceAll('Distance: ', '')
    .split('\n')
    .map((line) =>
      line
        .split(' ')
        .filter((value) => !!value)
        .map((num) => parseInt(num))
    )
    .forEach((numbers, index) => {
      if (index === 0) {
        races.push(...numbers.map((num) => ({ distance: 0, time: num })));
      } else {
        numbers.forEach((num, index) => {
          races[index].distance = num;
        });
      }
    });

  console.log(
    'firstStar',
    races.map(getWaysToBeatRace).reduce((acc, cur) => acc * cur.length, 1)
  );
};

const secondStar = async () => {
  const text = await file.text();

  const races: Race[] = [];

  text
    .replaceAll('Time:', '')
    .replaceAll('Distance: ', '')
    .split('\n')
    .map((line) =>
      line
        .split(' ')
        .filter((value) => !!value)
        .join('')
    )
    .map((num) => parseInt(num))
    .forEach((number, index) => {
      if (index === 0) {
        races.push({ distance: 0, time: number });
      } else {
        races[0].distance = number;
      }
    });

  console.log(
    'firstStar',
    races.map(getWaysToBeatRace).reduce((acc, cur) => acc * cur.length, 1)
  );
};

firstStar();
secondStar();
