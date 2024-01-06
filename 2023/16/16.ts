const file = Bun.file('16/file.txt');

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

type Location = { x: number; y: number };

type Beam = { location: Location; direction: Direction };

const locationInsideMap = (location: Location, map: string[][]): boolean => {
  return (
    location.x > -1 &&
    location.x < map[0].length &&
    location.y > -1 &&
    location.y < map.length
  );
};

const getNextLocation = (beam: Beam, map: string[][]): Location => {
  if (beam.direction === Direction.Up) {
    return { x: beam.location.x - 1, y: beam.location.y };
  } else if (beam.direction === Direction.Down) {
    return { x: beam.location.x + 1, y: beam.location.y };
  } else if (beam.direction === Direction.Left) {
    return { x: beam.location.x, y: beam.location.y - 1 };
  } else if (beam.direction === Direction.Right) {
    return { x: beam.location.x, y: beam.location.y + 1 };
  }

  throw new Error('Invalid direction');
};

const isBeamAtStart = (beam: Beam, map: string[][]): boolean => {
  const comingFromLeft =
    beam.direction === Direction.Right && beam.location.y === -1;
  const comingFromRight =
    beam.direction === Direction.Left && beam.location.y === map[0].length;
  const comingFromUp =
    beam.direction === Direction.Down && beam.location.x === -1;
  const comingFromDown =
    beam.direction === Direction.Up && beam.location.x === map.length;

  return comingFromLeft || comingFromRight || comingFromUp || comingFromDown;
};

const moveBeam = (
  beam: Beam,
  map: string[][],
  energizedSet: Set<string>
): Beam[] => {
  const returnBeams: Beam[] = [];

  while (locationInsideMap(beam.location, map) || isBeamAtStart(beam, map)) {
    if (
      energizedSet.has(
        `${beam.location.x},${beam.location.y}=${beam.direction}`
      )
    ) {
      break;
    }

    if (!isBeamAtStart(beam, map)) {
      energizedSet.add(
        `${beam.location.x},${beam.location.y}=${beam.direction}`
      );
    }

    const nextLocation = getNextLocation(beam, map);

    if (!locationInsideMap(nextLocation, map)) {
      break;
    }

    beam.location = nextLocation;

    const nextTile = map[nextLocation.x][nextLocation.y];

    if (nextTile === '.') {
      beam.location = nextLocation;
      continue;
    }

    if (nextTile === '|') {
      beam.location = nextLocation;

      if (
        beam.direction === Direction.Up ||
        beam.direction === Direction.Down
      ) {
        continue;
      }

      if (beam.direction === Direction.Left) {
        beam.direction = Direction.Down;
        returnBeams.push({ location: beam.location, direction: Direction.Up });
      } else if (beam.direction === Direction.Right) {
        beam.direction = Direction.Down;
        returnBeams.push({
          location: beam.location,
          direction: Direction.Up,
        });
      }
    } else if (nextTile === '-') {
      beam.location = nextLocation;

      if (
        beam.direction === Direction.Left ||
        beam.direction === Direction.Right
      ) {
        continue;
      }

      if (beam.direction === Direction.Up) {
        beam.direction = Direction.Right;
        returnBeams.push({
          location: beam.location,
          direction: Direction.Left,
        });
      } else if (beam.direction === Direction.Down) {
        beam.direction = Direction.Right;
        returnBeams.push({
          location: beam.location,
          direction: Direction.Left,
        });
      }
    } else if (nextTile === '/') {
      beam.location = nextLocation;

      if (beam.direction === Direction.Up) {
        beam.direction = Direction.Right;
      } else if (beam.direction === Direction.Down) {
        beam.direction = Direction.Left;
      } else if (beam.direction === Direction.Left) {
        beam.direction = Direction.Down;
      } else if (beam.direction === Direction.Right) {
        beam.direction = Direction.Up;
      }
    } else if (nextTile === '\\') {
      beam.location = nextLocation;

      if (beam.direction === Direction.Up) {
        beam.direction = Direction.Left;
      } else if (beam.direction === Direction.Down) {
        beam.direction = Direction.Right;
      } else if (beam.direction === Direction.Left) {
        beam.direction = Direction.Up;
      } else if (beam.direction === Direction.Right) {
        beam.direction = Direction.Down;
      }
    }
  }

  return returnBeams;
};

const firstStar = async () => {
  const text = await file.text();

  const map = text.split('\n').map((line) => line.split(''));
  const energizedSet = new Set<string>();

  const beams: Beam[] = [
    { location: { x: 0, y: -1 }, direction: Direction.Right },
  ];

  while (beams.length > 0) {
    const newBeams = moveBeam(beams.shift()!, map, energizedSet);
    beams.push(...newBeams);
  }

  const helperSet = new Set<string>(
    Array.from(energizedSet).map((location) => location.split('=')[0])
  );

  console.log('firstStar:', helperSet.size);
};

const calculateEdgeBeams = (map: string[][]): Beam[] => {
  const result = [];

  for (let i = 0; i < map[0].length; i++) {
    result.push({ location: { x: -1, y: i }, direction: Direction.Down });
  }

  for (let i = 0; i < map[0].length; i++) {
    result.push({ location: { x: map.length, y: i }, direction: Direction.Up });
  }

  for (let i = 0; i < map.length; i++) {
    result.push({ location: { x: i, y: -1 }, direction: Direction.Right });
  }

  for (let i = 0; i < map.length; i++) {
    result.push({
      location: { x: i, y: map[0].length },
      direction: Direction.Left,
    });
  }

  return result;
};

const secondStar = async () => {
  const text = await file.text();

  const map = text.split('\n').map((line) => line.split(''));

  let maxEnergizedTiles = 0;

  const edgeBeams = calculateEdgeBeams(map);

  for (const edgeBeam of edgeBeams) {
    const energizedSet = new Set<string>();
    const beams: Beam[] = [edgeBeam];

    while (beams.length > 0) {
      const newBeams = moveBeam(beams.shift()!, map, energizedSet);
      beams.push(...newBeams);
    }

      const helperSet = new Set<string>(
        Array.from(energizedSet).map((location) => location.split('=')[0])
      );

    if (helperSet.size > maxEnergizedTiles) {
      maxEnergizedTiles = helperSet.size;
    }
  }

  console.log('secondStar:', maxEnergizedTiles);
};

firstStar();
secondStar();
