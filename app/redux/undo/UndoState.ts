import { ReduxState } from "../AppReducer";
import { ActionWrapper, createActionWrapper, TypedAction } from "../utils/typedAction";
import { newTypedReducer, Reducer } from "../utils/typedReducer";

const DefaultStackSize = 50;

export interface UndoableType<S> {
  reducer: Reducer<Undoable<S>>;
  actions: {
    undo: ActionWrapper<void>;
    redo: ActionWrapper<void>;
    set: ActionWrapper<S>;
  }
}

export interface Undoable<S> {
  index: number;
  stateStack: S[];
}

export interface UndoConfig<S> {
  denominator: string;
  initialState: S;
  stackSize?: number;
  comparator?: (oldState: S, newState: S) => boolean;
}

export function undoable<S>(
  reducer: Reducer<S>,
  {
    denominator,
    stackSize,
    comparator,
    initialState,
  }: UndoConfig<S>,
): UndoableType<S> {

  const undoAction = createActionWrapper<void>(`${denominator}::undo`);
  const redoAction = createActionWrapper<void>(`${denominator}::redo`);
  const setAction = createActionWrapper<S>(`${denominator}::set`);

  const undoReducer = (state: Undoable<S>): Undoable<S> => {
    if (state.index === 0) {
      return state;
    }
    return {
      ...state,
      index: state.index - 1,
    };
  }

  const redoReducer = (state: Undoable<S>): Undoable<S> => {
    if (state.index >= state.stateStack.length - 1) {
      return state;
    }
    return {
      ...state,
      index: state.index + 1,
    }
  };

  const setReducer = (state: Undoable<S>, innerState: S): Undoable<S> => {
    return {
      index: 0,
      stateStack: [innerState],
    };
  }

  const normalReducer = (
    undoState: Undoable<S>,
    action: TypedAction<any>,
  ): Undoable<S> => {
    if (undoState == null) {
      const newState = reducer(initialState, action);
      return {
        stateStack: [newState],
        index: 0,
      };
    } else {
      const { stateStack, index } = undoState;
      const oldState = stateStack[index];
      const newState = reducer(oldState, action);
      let newIndex = index;
      const changed = comparator(oldState, newState);
      const newStack = [...stateStack];
      if (changed) {
        if (!!action.meta?.ignoreUndo) {
          newStack.splice(index, newStack.length - index);
          newStack.push(newState);
        } else {
          newStack.splice(index + 1, newStack.length - index);
          newStack.push(newState);
          newIndex++;
        }
      }
      const maxSize = stackSize ?? DefaultStackSize;
      if (newStack.length > maxSize) {
        newStack.unshift();
      }
      return {
        stateStack: newStack,
        index: newIndex,
      };
    }
  }

  const undoableReducer = newTypedReducer<Undoable<S>>()
    .handlePayload(undoAction.type, undoReducer)
    .handlePayload(redoAction.type, redoReducer)
    .handlePayload(setAction.type, setReducer)
    .handleDefault(normalReducer)
    .build();

  return {
    reducer: undoableReducer,
    actions: {
      undo: undoAction,
      redo: redoAction,
      set: setAction,
    },
  }
}

export const getStateFromUndoable = <S>(state: Undoable<S>): S => {
  return state.stateStack[state.index];
}

export const canUndo = <S>(state: Undoable<S>): boolean => {
  return state.index > 0;
}

export const canRedo = <S>(state: Undoable<S>): boolean => {
  return state.index < state.stateStack.length - 1;
}
