export function setIntersection<T>(...sets: Set<T>[]): Set<T> {
  if (sets.length === 0) {
    return new Set();
  } else if (sets.length === 1) {
    return sets[0];
  } else {
    const intersection = new Set<T>();
    const [first, ...rest] = sets;
    for (const item of first) {
      if (!rest.find((set) => !set.has(item))) {
        intersection.add(item);
      }
    }
    return intersection;
  }
}
