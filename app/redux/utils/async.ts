export type Async<T> = { value: T | undefined, loading: boolean, error?: string } | null;

export function isAsyncNotLoaded<T>(async: Async<T>): async is null {
  return async === null;
}

export function isAsyncLoading<T>(async: Async<T>): boolean {
  if (isAsyncNotLoaded(async)) {
    return false;
  }
  return async.loading === true;
}

export function isAsyncLoaded<T>(async: Async<T>): boolean {
  if (isAsyncNotLoaded(async)) {
    return false;
  }
  return async.loading === false && async.value != null;
}

export function isAsyncError<T>(async: Async<T>): boolean {
  if (isAsyncNotLoaded(async)) {
    return false;
  }
  return async.loading === false && async.error != null;
}

export function asyncLoading<T>(): Async<T> {
  return { value: undefined, loading: true };
}

export function asyncLoaded<T>(value: T): Async<T> {
  return { value, loading: false };
}

export function asyncError<T>(error: string): Async<T> {
  return { value: undefined, loading: false, error };
}
