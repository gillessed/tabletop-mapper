export function getPairs<T>(a: T[], wrap?: boolean): { p1: T, p2: T}[] {
  if (a.length < 2) {
    return [];
  }
  const pairs: { p1: T, p2: T}[] = [];
  for (let i = 0; i < a.length - 1; i++) {
    pairs.push({
      p1: a[i],
      p2: a[i + 1],
    });
  }
  if (wrap) {
    pairs.push({
      p1: a[a.length - 1],
      p2: a[0],
    });
  }
  return pairs;
}
