import { ReduxState } from "./AppReducer";
import { Grid } from "./grid/GridTypes";
import { TypedAction } from "./utils/typedAction";

let enableLogging = true;
let enableLogMousePosition = false;
let enableLogTransform = false;

(window as any).repl = {
  ...((window as any).repl ?? {}),
  setLogging: (value: boolean) => {
    enableLogging = value;
  },
  setLogMousePosition: (value: boolean) => {
    enableLogMousePosition = value;
  },
  setLogTransform: (value: boolean) => {
    enableLogTransform = value;
  },
}

export function loggerPredicate(getState: () => ReduxState, action: TypedAction<any>): boolean {
  if (!enableLogging) {
    return false;
  } else if (action.type === Grid.Actions.setMousePosition.type) {
    return enableLogMousePosition;
  } else if (action.type === Grid.Actions.setTransform.type) {
    return enableLogTransform;
  } else if (action.type === Grid.Actions.setMouseOnCanvas.type) {
    return false;
  }
  return true;
}
