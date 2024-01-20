// I couldn't figure out how to do this in a reasonable amount of time, so I looked up the solution
export function check(
  one: number[],
  two: number[],
  left: number,
  right: number
): boolean {
  // b values or positions, v values are velocities
  const [b1x, b1y, b1z, v1x, v1y, v1z] = one;
  const [b2x, b2y, b2z, v2x, v2y, v2z] = two;

  // used to prevent unnecessary calculations
  let good = true;

  if (v1x * v2y - v2x * v1y === 0) {
    good = false;
  }

  if (good) {
    // find x and y intersecting
    // turn parametric equations x(t) = vx * t + bx, y(t) = vy* t + by into  y = mx + b by solving for m and b
    // then use these equations to calculate the intersection between two such equations,  noting that:
    // m = vy / vx, b = by - vy/vx * bx
    const x =
      -(v1x * v2x * (b1y - b2y) + v1x * v2y * b2x - v2x * v1y * b1x) /
      (v2x * v1y - v1x * v2y);
    const y =
      -(v1y * v2y * (b1x - b2x) + v1y * v2x * b2y - v2y * v1x * b1y) /
      (v2y * v1x - v1y * v2x);

    if (!(left <= x && x <= right) || !(left <= y && y <= right)) {
      // if the intersection is not in range
      good = false;
    }

    if (good) {
      // x = vx * t + b ->  t = (x - b)
      if (
        (v1x !== 0 && (x - b1x) / v1x < 0) ||
        (v2x !== 0 && (x - b2x) / v2x < 0) ||
        (v1y !== 0 && (y - b1y) / v1y < 0) ||
        (v2y !== 0 && (y - b2y) / v2y < 0)
      ) {
        good = false;
      }
    }
  }

  return good;
}
