const file = await Bun.file('23/file.txt').text();

const firstStar = () => {
  const grid = file.split('\n').map((line) => line.split(''));

  const startY = grid[0].indexOf('.');

  const endY = grid[grid.length - 1].indexOf('.');
  const end = `${grid.length - 1},${endY}`;

  const pathMap = new Map<number, string[]>();
  pathMap.set(0, [`${0},${startY}`]);

  let pathIds: number[] = [0];

  let maxId = 0;
  const finishedPaths: number[] = [];

  const addToExistingPath = (pathId: number, x: number, y: number) => {
    if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) return;
    if (grid[x][y] === '#') return;

    const newStep = `${x},${y}`;

    const path = pathMap.get(pathId)!;

    if (!path.includes(newStep)) {
      pathMap.set(pathId, [...pathMap.get(pathId)!, newStep]);

      pathIds.push(pathId);
    }
  };

  const createNewPath = (pathId: number, x: number, y: number) => {
    if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) return;
    if (grid[x][y] === '#') return;

    const newStep = `${x},${y}`;
    const existingPath = pathMap.get(pathId)!;

    if (!existingPath.includes(newStep)) {
      const newPath = [...existingPath, newStep];
      maxId++;
      pathMap.set(maxId, newPath);
      pathIds.push(maxId);
    }
  };

  while (pathIds.length > 0) {
    const idCopy = [...pathIds];
    pathIds = [];
    for (let path of idCopy) {
      const steps = pathMap.get(path)!;
      const [x, y] = steps[steps.length - 1].split(',').map(Number);
      const value = grid[x][y];

      if (`${x},${y}` === end) {
        finishedPaths.push(path);
        continue;
      }

      switch (value) {
        case '>':
          addToExistingPath(path, x, y + 1);
          break;
        case '<':
          addToExistingPath(path, x, y - 1);
          break;
        case '^':
          addToExistingPath(path, x - 1, y);
          break;
        case 'v':
          addToExistingPath(path, x + 1, y);
          break;
        default:
          createNewPath(path, x, y + 1);
          createNewPath(path, x, y - 1);
          createNewPath(path, x - 1, y);
          createNewPath(path, x + 1, y);
          break;
      }
    }
  }
  console.log(
    'firstStar',
    Math.max(...finishedPaths.map((path) => pathMap.get(path)!.length - 1))
  );
};

class Step {
  constructor(public x: number, public y: number, public prev?: Step) {}

  hasAsPrevious(node: Step): boolean {
    if (!this.prev) return false;
    if (this.prev.x === node.x && this.prev.y === node.y) return true;
    return this.prev.hasAsPrevious(node);
  }

  get size(): number {
    if (!this.prev) return 1;
    return 1 + this.prev.size;
  }
}

class Node {
  neighbors: { node: Node; distance: number }[] = [];
  constructor(public x: number, public y: number) {}
}

const isValid = (grid: string[][], x: number, y: number): boolean => {
  return x >= 0 && y >= 0 && x < grid.length && y < grid[0].length;
};

const isIntersection = (grid: string[][], x: number, y: number): boolean => {
  const a = isValid(grid, x + 1, y) && grid[x + 1][y] !== '#' ? 1 : 0;
  const b = isValid(grid, x - 1, y) && grid[x - 1][y] !== '#' ? 1 : 0;
  const c = isValid(grid, x, y + 1) && grid[x][y + 1] !== '#' ? 1 : 0;
  const d = isValid(grid, x, y - 1) && grid[x][y - 1] !== '#' ? 1 : 0;

  return a + b + c + d >= 3;
};

const createNodes = (grid: string[][]): Node[] => {
  const nodes: Node[] = [];
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      const value = row[y];
      if (value === '#' || !isIntersection(grid, x, y)) continue;
      nodes.push(new Node(x, y));
    }
  }
  return nodes;
};

const findNeighbors = (
  grid: string[][],
  node: Node,
  nodes: Node[]
): { node: Node; distance: number }[] => {
  const pathMap = new Map<number, Step>();
  pathMap.set(0, new Step(node.x, node.y));

  const result: { node: Node; distance: number }[] = [];
  let pathIds: number[] = [0];

  let maxId = 0;

  const createNewPath = (pathId: number, x: number, y: number) => {
    if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) return;
    if (grid[x][y] === '#') return;

    const existingPath = pathMap.get(pathId)!;
    const newStep = new Step(x, y, existingPath);

    if (!existingPath.hasAsPrevious(newStep)) {
      maxId++;
      pathMap.set(maxId, newStep);
      pathIds.push(maxId);
    }
  };

  while (pathIds.length > 0) {
    const idCopy = [...pathIds];
    pathIds = [];
    for (let path of idCopy) {
      const step = pathMap.get(path)!;

      const currentNode: Node | undefined = nodes
        .filter((n) => n !== node)
        ?.find((n) => n.x === step.x && n.y === step.y);

      if (currentNode) {
        result.push({ node: currentNode, distance: step.size - 1 });
        continue;
      }

      createNewPath(path, step.x, step.y + 1);
      createNewPath(path, step.x, step.y - 1);
      createNewPath(path, step.x - 1, step.y);
      createNewPath(path, step.x + 1, step.y);

      pathMap.delete(path);
    }
  }

  return result;
};

const findLongestPath = (start: Node, end: Node, nodes: Node[]): number => {
  const pathMap = new Map<number, Step>();
  pathMap.set(0, new Step(start.x, start.y));

  const result: number[] = [];
  let pathIds: number[] = [0];

  let maxId = 0;

  const createNewPath = (pathId: number, x: number, y: number) => {
    const existingPath = pathMap.get(pathId)!;
    const newStep = new Step(x, y, existingPath);

    if (!existingPath.hasAsPrevious(newStep)) {
      maxId++;
      pathMap.set(maxId, newStep);
      pathIds.push(maxId);
    }
  };

  while (pathIds.length > 0) {
    const idCopy = [...pathIds];
    pathIds = [];
    for (let path of idCopy) {
      const step = pathMap.get(path)!;

      const currentNode: Node | undefined = nodes?.find(
        (n) => n.x === step.x && n.y === step.y
      );

      if (!currentNode) continue;

      if (currentNode && currentNode.x === end.x && currentNode.y === end.y) {
        result.push(path);
        continue;
      }

      currentNode.neighbors.forEach((neighbor) => {
        createNewPath(path, neighbor.node.x, neighbor.node.y);
      });

      pathMap.delete(path);
    }
  }

  const lengths = result.map((path) => {
    const steps = pathMap.get(path)!;

    const getNode = (x: number, y: number): Node | undefined => {
      return nodes.find((node) => node.x === x && node.y === y);
    };

    const getPathLength = (step: Step): number => {
      let currentNode = getNode(step.x, step.y);
      let currentStep = step;
      let distance = 0;
      while (currentNode) {
        currentNode = getNode(currentStep.x, currentStep.y);

        if (!currentNode || !currentStep || !currentStep.prev) break;

        const previousNode = getNode(currentStep.prev!.x, currentStep.prev!.y);
        if (!previousNode) {
          break;
        }

        distance +=
          currentNode.neighbors.find((n) => n.node === previousNode)
            ?.distance ?? 0;

        currentNode = previousNode;
        currentStep = currentStep.prev!;
      }

      return distance;
    };
    return getPathLength(steps);
  });

  return lengths.sort((a, b) => b - a)[0];
};

const secondStar = () => {
  const grid = file.split('\n').map((line) => line.split(''));

  const startY = grid[0].indexOf('.');

  const endY = grid[grid.length - 1].indexOf('.');
  const endX = grid.length - 1;

  const pathMap = new Map<number, Step>();
  pathMap.set(0, new Step(0, startY));

  const startNode = new Node(0, startY);
  const endNode = new Node(endX, endY);
  const nodes = createNodes(grid);
  nodes.push(startNode);
  nodes.push(endNode);
  nodes.forEach((node) => (node.neighbors = findNeighbors(grid, node, nodes)));

  console.log('secondStar', findLongestPath(startNode, endNode, nodes));
};

firstStar();
secondStar();
