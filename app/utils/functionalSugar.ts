export function curry2<A1, A2, R>(f: (arg1: A1, arg2: A2) => R): (arg1: A1) => (arg2: A2) => R {
  return function f1(arg1: A1) {
    return function f2(arg2: A2) {
      return f(arg1, arg2);
    }
  }
}

export function curry3<A1, A2, A3, R>(f: (arg1: A1, arg2: A2, arg3: A3) => R): (arg1: A1) => (arg2: A2) => (arg3: A3) => R {
  return function f1(arg1: A1) {
    return function f2(arg2: A2) {
      return function f3(arg3: A3) {
        return f(arg1, arg2, arg3);
      }
    }
  }
}

export function swapArgs2<A1, A2, R>(f: (arg1: A1, arg2: A2) => R): (arg2: A2, arg1: A1) => R {
  return function g(arg2: A2, arg1: A1) {
    return f(arg1, arg2);
  }
}
