import * as React from 'react';

export function useBooleanState(initialValue: boolean) {
  const [state, setState] = React.useState(initialValue);
  const setTrue = React.useCallback(() => setState(true), [setState]);
  const setFalse = React.useCallback(() => setState(false), [setState]);
  const toggle = React.useCallback(() => setState(!state), [setState, state]);
  return {
    state,
    setState,
    setTrue,
    setFalse,
    toggle,
  };
}