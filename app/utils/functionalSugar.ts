export function curry2<A1, A2 extends unknown[], R>(f: (arg1: A1, ...arg2: A2) => R): (arg1: A1) => (...arg2: A2) => R {
  return function f1(arg1: A1) {
    return function f2(...arg2: A2) {
      return f(arg1, ...arg2);
    }
  }
}

export function curry2Reverse<A1, A2 extends unknown[], R>(f: (arg1: A1, ...arg2: A2) => R): (...arg2: A2) => (arg1: A1) => R {
  return function f2(...arg2: A2) {
    return function f1(arg1: A1) {
      return f(arg1, ...arg2);
    }
  }
}

export function swapArgs2<A1, A2, R>(f: (arg1: A1, arg2: A2) => R): (arg2: A2, arg1: A1) => R {
  return function g(arg2: A2, arg1: A1) {
    return f(arg1, arg2);
  }
}
