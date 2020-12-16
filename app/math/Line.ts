import { Coordinate } from "./Vector";

export interface Line {
  p1: Coordinate;
  p2: Coordinate;
  p1Bound: boolean;
  p2Bound: boolean;
}

/**
 * y = a1 * x + b1
 * y = a2 * x + b2
 * 0 = (a2 - a1) * x + (b2 - b1)
 * x = (b1 - b2) / (a2 - a1)
 */


// returns true iff the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
export function lineIntersection(
  l1: Line,
  l2: Line,
): Coordinate | undefined {
  const l1dx = l1.p2.x - l1.p1.x;
  const l1dy = l1.p2.y - l1.p1.y;
  const l2dx = l2.p2.x - l2.p1.x;
  const l2dy = l2.p2.y - l2.p1.y;
  const determinant = (l1dx * l2dy) - (l1dy * l2dx);
  if (determinant === 0) {
    return undefined;
  }
  const ra = l2.p2.x - l1.p1.x;
  const sb = l2.p2.y - l1.p1.y;
  const t1 = ((l2dy * ra) + (-l2dx * sb)) / determinant;
  const t2 = ((-l1dy * ra) + (l1dx * sb)) / determinant;
  const inL1Lower = !l1.p1Bound || (t1 > 0);
  const inL1Upper = !l1.p2Bound || (t1 < 1);
  const inL2Lower = !l2.p1Bound || (t2 > 0);
  const inL2Upper = !l2.p2Bound || (t2 < 1);
  if (!inL1Lower || !inL1Upper || !inL2Lower || !inL2Upper) {
    return undefined;
  }
  const point = {
    x: l1.p1.x + l1dx * t1,
    y: l1.p1.y + l1dy * t1,
  };
  return point;
}
