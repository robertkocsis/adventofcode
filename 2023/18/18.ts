const file = await Bun.file('18/file.txt');

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

const firstStar = async () => {
  const text = await file.text();

  const points: Array<[number, number]> = [];

  const lines = text.split('\n').map((line) => line.split(' '));

  lines.forEach((line) => {
    const lastPoint = points[points.length - 1];
    const [direction, stringAmount, color] = line;

    let [x, y] = lastPoint ?? [0, 0];

    const amount = parseInt(stringAmount);

    for (let i = 0; i < amount; i++) {
      switch (direction) {
        case 'U':
          y++;
          break;
        case 'D':
          y--;
          break;
        case 'L':
          x--;
          break;
        case 'R':
          x++;
          break;
      }

      points.push([x, y]);
    }
  });

  const area = getAreaUsingShoelaceFormula(points) + points.length;
  const result = area - Math.round(points.length / 2) + 1;

  console.log('firstStart', result);
};

const secondStar = async () => {
  const text = await file.text();

  const points: Array<[number, number]> = [];

  const lines = text.split('\n').map((line) => line.split(' '));

  lines.forEach((line) => {
    const lastPoint = points[points.length - 1];
    let [, , color] = line;

    color = color.replace('#', '');
    color = color.replace('(', '');
    color = color.replace(')', '');

    const amount = parseInt(color.substring(0, color.length - 1), 16);
    const direction = parseInt(color[color.length - 1]);

    let [x, y] = lastPoint ?? [0, 0];

    for (let i = 0; i < amount; i++) {
      switch (direction) {
        case 3:
          y++;
          break;
        case 1:
          y--;
          break;
        case 2:
          x--;
          break;
        case 0:
          x++;
          break;
      }

      points.push([x, y]);
    }
  });

  const area = getAreaUsingShoelaceFormula(points) + points.length;
  const result = area - Math.round(points.length / 2) + 1;

  console.log('secondStar', result);
};

firstStar();
secondStar();
