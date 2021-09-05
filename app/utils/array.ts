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

export function range(count: number, start: number = 0): number[] {
  const array: number[] = [];
  for (let i = 0; i < count; i++) {
    array.push(i + start);
  }
  return array;
}

export function compact<T>(array: Array<T | null | undefined>): T[] {
  const filtered: T[] = [];
  for (const element of array) {
    if (element != null) {
      filtered.push(element);
    }
  }
  return filtered;
}

export function arrayEquals<T>(a1: T[], a2: T[]): boolean {
  if (a1 == null && a2 == null) {
    return true;
  }
  if (a1 == null || a2 == null) {
    return false;
  }
  if (a1.length !== a2.length) {
    return false;
  }
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}
