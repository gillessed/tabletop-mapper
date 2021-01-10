export function checkNotNull<T>(value: T, name: string): T {
  if (value == null) {
    throw Error(`checkNotNull failed for [${name}]`);
  } else {
    return value;
  }
}
