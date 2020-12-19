export enum MatchScore {
  Exact = 1,
  Start = 2,
  Substring = 3,
  Broken = 4,
}

export function stringSearch(query: string, target: string): MatchScore | undefined {
  if (query === target) {
    return MatchScore.Exact;
  } else if (target.startsWith(query)) {
    return MatchScore.Start;
  } else if (target.indexOf(query) >= 0) {
    return MatchScore.Substring;
  }
  // TODO: (gcole) broken string matching
  return undefined;
}
