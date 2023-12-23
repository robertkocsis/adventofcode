const file = Bun.file('10/file.txt');

enum PipeType {
  NS = '|',
  EW = '-',
  NE = 'L',
  NW = 'J',
  SW = '7',
  SE = 'F',
}

interface Pipe {
  type: PipeType | 'S';
  backward?: Pipe;
  forward?: Pipe;
  x: number;
  y: number;
}

const getConnectingCoordinates = (pipe: Pipe) => {
  switch (pipe.type) {
    case PipeType.NS:
      return [
        { x: pipe.x - 1, y: pipe.y },
        { x: pipe.x + 1, y: pipe.y },
      ];
    case PipeType.EW:
      return [
        { x: pipe.x, y: pipe.y - 1 },
        { x: pipe.x, y: pipe.y + 1 },
      ];
    case PipeType.NE:
      return [
        { x: pipe.x - 1, y: pipe.y },
        { x: pipe.x, y: pipe.y + 1 },
      ];
    case PipeType.NW:
      return [
        { x: pipe.x - 1, y: pipe.y },
        { x: pipe.x, y: pipe.y - 1 },
      ];
    case PipeType.SW:
      return [
        { x: pipe.x, y: pipe.y - 1 },
        { x: pipe.x + 1, y: pipe.y },
      ];
    case PipeType.SE:
      return [
        { x: pipe.x, y: pipe.y + 1 },
        { x: pipe.x + 1, y: pipe.y },
      ];
    case 'S':
      throw new Error('S is not a direction');
  }
};

const getMainLoop = (map: string[][]): Pipe[] => {
  const pipes: Pipe[] = [];
  const directionValues = Object.values(PipeType);

  map.forEach((line, x) => {
    line.forEach((char, y) => {
      if (directionValues.includes(char as PipeType)) {
        pipes.push({ type: char as PipeType, x, y });
      } else if (char === 'S') {
        pipes.push({ x, y, type: 'S' });
      }
    });
  });

  const start = pipes.find((p) => p.type === 'S');

  const pipeConnectingToStart = pipes.filter((pipe) => {
    if (pipe.type === 'S') return false;
    const [left, right] = getConnectingCoordinates(pipe);

    return (
      (left.x === start!.x && left.y === start!.y) ||
      (right.x === start!.x && right.y === start!.y)
    );
  })[0];

  pipeConnectingToStart.backward = start;
  start!.forward = pipeConnectingToStart;

  let currentPipe = pipeConnectingToStart;

  const result = [];
  while (currentPipe.type !== 'S') {
    result.push(currentPipe);

    const [left, right] = getConnectingCoordinates(currentPipe);
    const leftPipe = pipes.find((p) => p.x === left.x && p.y === left.y);
    const rightPipe = pipes.find((p) => p.x === right.x && p.y === right.y);

    if (leftPipe !== currentPipe.backward) {
      currentPipe.forward = leftPipe;
      leftPipe!.backward = currentPipe;
      currentPipe = leftPipe!;
    } else if (rightPipe !== currentPipe.backward) {
      currentPipe.forward = rightPipe;
      rightPipe!.backward = currentPipe;
      currentPipe = rightPipe!;
    }
  }
  return result;
};

const firstStar = async () => {
  const lines = (await file.text()).split('\n');
  const map = lines.map((line) => line.split(''));
  const pipes: Pipe[] = getMainLoop(map);

  console.log('firstStar', Math.round(pipes.length / 2));
};

function getAreaUsingShoelaceFormula(vertices: [number, number][]): number {
  let area = 0;

  for (let i = 0; i < vertices.length; i++) {
    const nextIndex = (i + 1) % vertices.length;
    const [currentY, currentX] = vertices[i];
    const [nextY, nextX] = vertices[nextIndex];
    area += currentX * nextY - currentY * nextX;
  }

  area = Math.abs(area) / 2;

  return area;
}

const secondStar = async () => {
  const lines = (await file.text()).split('\n');
  const map = lines.map((line) => line.split(''));

  const pipes: Pipe[] = getMainLoop(map);

  const area = getAreaUsingShoelaceFormula(pipes.map((p) => [p.x, p.y]));
  const result = area - Math.round(pipes.length / 2) + 1;
  console.log('secondStar', result);
};

firstStar();
secondStar();
