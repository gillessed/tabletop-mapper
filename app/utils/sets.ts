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

export function setFirst<T>(iterable: Iterable<T>): T {
  for (const t of iterable) {
    return t;
  }
}

export function setMax<T>(
  iterable: Iterable<T>,
  valueFunction: (t: T) => number,
): T {
  let tmax = setFirst(iterable);
  let maxValue = valueFunction(tmax);
  for (const t of iterable) {
    const value = valueFunction(t);
    if (value > maxValue) {
      tmax = t;
      maxValue = value;
    }
  }
  return tmax;
}

export function pickRandom<T>(
  iterable: Iterable<T>,
  count: number,
): Set<T> {
  let array = [...iterable];
  const picks = new Set<T>();
  for (let i = 0; i < count; i++) {
    if (array.length === 0) {
      break;
    }
    const pick = Math.floor(Math.random() * array.length);
    picks.add(array[pick]);
    array.splice(pick, 1);
  }
  return picks;
}
