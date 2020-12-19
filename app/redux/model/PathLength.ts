import { Coordinate, coordinateDistance } from "../../math/Vector";
import { getPairs } from "../../utils/array";

export function getPathLength(path: Coordinate[], closed?: boolean) {
  const pairs = getPairs(path, closed);
  const length = pairs.reduce((acc: number, { p1, p2 }) => acc + coordinateDistance(p1, p2), 0);
  return length;
}
