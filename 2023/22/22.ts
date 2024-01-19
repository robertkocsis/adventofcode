const file = await Bun.file('22/file.txt').text();

type Point = { x: number; y: number };

function areSegmentsOverlapping(
  a: Point,
  b: Point,
  c: Point,
  d: Point
): boolean {
  // Check bounding boxes
  const xOverlap =
    Math.max(a.x, b.x) >= Math.min(c.x, d.x) &&
    Math.min(a.x, b.x) <= Math.max(c.x, d.x);
  const yOverlap =
    Math.max(a.y, b.y) >= Math.min(c.y, d.y) &&
    Math.min(a.y, b.y) <= Math.max(c.y, d.y);

  if (!xOverlap || !yOverlap) {
    return false; // Bounding boxes do not overlap
  }

  // Check orientation
  const orientation1 = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  const orientation2 = (b.y - a.y) * (d.x - b.x) - (b.x - a.x) * (d.y - b.y);

  if (orientation1 * orientation2 > 0) {
    return false; // Orientations are the same (lines do not overlap)
  }

  // Check for actual overlap within line segments
  return true;
}

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

interface Brick {
  start: Coordinate;
  end: Coordinate;
}

const createBricks = (input: string): Brick[] => {
  const bricks: Brick[] = [];

  input.split('\n').forEach((line) => {
    const [start, end] = line
      .split('~')
      .map((coordinate) => coordinate.split(',').map(Number));

    bricks.push({
      start: { x: start[0], y: start[1], z: start[2] },
      end: { x: end[0], y: end[1], z: end[2] },
    });
  });

  return bricks;
};

const removeBrickFromLevels = (levels: Map<number, Brick[]>, brick: Brick) => {
  const { start, end } = brick;

  for (let z = start.z; z <= end.z; z++) {
    levels.set(
      z,
      levels.get(z)!.filter((b) => b !== brick)
    );
  }
};

const placeBrickOnLevels = (levels: Map<number, Brick[]>, brick: Brick) => {
  const { start, end } = brick;

  for (let z = start.z; z <= end.z; z++) {
    const level = levels.get(z) ?? [];
    level.push(brick);
    levels.set(z, level);
  }
};

const settleBricks = (levels: Map<number, Brick[]>) => {
  let topFloor = Math.max(...Array.from(levels.keys()));

  let bricksChanged = true;

  while (bricksChanged) {
    bricksChanged = false;

    for (let i = 2; i <= topFloor; i++) {
      const bricks = levels.get(i);

      bricks?.forEach((brick) => {
        const hitFloor =
          getBrickHolders(brick, levels).length > 0 || brick.start.z === 1;

        if (hitFloor) {
          return;
        }

        removeBrickFromLevels(levels, brick);
        brick.start.z--;
        brick.end.z--;
        placeBrickOnLevels(levels, brick);

        bricksChanged = true;
      });
    }
  }
};

const getBrickHolders = (
  brick: Brick,
  levels: Map<number, Brick[]>
): Brick[] => {
  const { start } = brick;

  const levelBelow = levels.get(start.z - 1) ?? [];

  const holdingBricks = levelBelow
    .filter((brickBelow) => brick !== brickBelow)
    .filter((brickBelow) =>
      areSegmentsOverlapping(
        brick.start,
        brick.end,
        brickBelow.start,
        brickBelow.end
      )
    );

  return holdingBricks;
};

const getHeldBricks = (brick: Brick, levels: Map<number, Brick[]>): Brick[] => {
  const { end } = brick;

  const levelAbove = levels.get(end.z + 1) ?? [];

  const heldBricks = levelAbove
    .filter((b) => b !== brick)
    .filter((brickAbove) =>
      areSegmentsOverlapping(
        brick.start,
        brick.end,
        brickAbove.start,
        brickAbove.end
      )
    );

  return heldBricks;
};

const firstStar = () => {
  const bricks = createBricks(file);

  const levels = new Map<number, Brick[]>();
  bricks.forEach((brick) => placeBrickOnLevels(levels, brick));

  settleBricks(levels);

  const safelyRemovableBricks = bricks.filter((brick, i) => {
    const heldBricks = getHeldBricks(brick, levels);
    const bricksWithOneHolder = heldBricks.filter(
      (heldBrick) => getBrickHolders(heldBrick, levels).length === 1
    );

    return bricksWithOneHolder.length === 0 || heldBricks.length === 0;
  }).length;

  console.log('firstStar', safelyRemovableBricks);
};

const removeBrick = (
  brick: Brick,
  levels: Map<number, Brick[]>,
  countSelf = false,
  alreadyRemoved: Set<Brick> = new Set<Brick>()
): number => {
  alreadyRemoved.add(brick);
  const heldBricks = getHeldBricks(brick, levels);

  if (heldBricks.length === 0) {
    return countSelf ? 1 : 0;
  }

  const bricksWithoutHolders = heldBricks.filter((brick) => {
    const brickHolders = getBrickHolders(brick, levels);
    return (
      brickHolders.filter((brickHolder) => !alreadyRemoved.has(brickHolder))
        .length === 0
    );
  });

  const result = bricksWithoutHolders
    .map((heldBrick) => removeBrick(heldBrick, levels, true, alreadyRemoved))
    .reduce((a, b) => a + b, countSelf ? 1 : 0);
  return result;
};

const secondStar = () => {
  const bricks = createBricks(file);

  const levels = new Map<number, Brick[]>();
  bricks.forEach((brick) => placeBrickOnLevels(levels, brick));

  settleBricks(levels);

  let sum = 0;

  const letters: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');

  bricks.forEach((brick, i) => {
    sum += removeBrick(brick, levels, false);
  });

  console.log('secondStar', sum);
};

firstStar();
secondStar();
