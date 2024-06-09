import { Action, UnknownAction } from "redux";

export interface TypedAction<T> extends Action, UnknownAction {
  payload: T;
  meta?: any;
}

export interface ActionWrapper<T> {
  type: ActionType<T>;
  create: (payload: T, meta?: any) => TypedAction<T>;
}

export type ActionType<T> = string & {
  __action_type_brand?: T;
};

export interface ActionMetadata {
  ignoreUndo?: boolean;
}

export function createActionType<T>(type: string): ActionType<T> {
  return type;
}

export function createAction<T, P extends T>(
  type: ActionType<T>,
  payload: P,
  meta?: any
): TypedAction<T> {
  return { type, payload, meta };
}

export function createPlaceholderAction<P>(payload: P): TypedAction<P> {
  return { type: "none", payload };
}

export function isActionType<T>(
  action: Action,
  type: ActionType<T>
): action is TypedAction<T> {
  return action.type === type;
}

export interface TypedActionCreator<T> {
  (payload: T, meta?: any): TypedAction<T>;
}

export function createActionCreator<T>(type: ActionType<T>): (
  payload: T,
  meta?: any
) => {
  type: string;
  payload: T;
} {
  return (payload, meta) => createAction(type, payload, meta);
}

export function createActionWrapper<T>(type: string): ActionWrapper<T> {
  const actionType = createActionType<T>(type);
  return {
    type: actionType,
    create: createActionCreator(actionType),
  };
}
