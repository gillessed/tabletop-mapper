import { Dispatch } from 'react';
import { Task } from 'redux-saga';
import { call, cancel, fork, take } from 'redux-saga/effects';
import { ActionType, createActionCreator, createActionType } from './utils/typedAction';

export interface SagaListener<PAYLOAD> {
  actionType: ActionType<PAYLOAD>;
  callback: (payload: PAYLOAD) => void;
}

export const ListenerLoop = function*(listeners: Set<SagaListener<any>>) {
  while (true) {

    const handlers: any[] = [];
    listeners.forEach((listener) => {
      const handler = function*() {
        while (true) {
          const action = yield take(listener.actionType);
          yield call(listener.callback, action.payload);
        }
      };
      handlers.push(handler);
    });
    
    const forks: Task[] = [];
    for (let handler of handlers) {
      const listenerFork: Task = yield fork(handler);
      forks.push(listenerFork);
    }

    yield take(LISTENER_RESET);

    for (let listenerFork of forks) {
      yield cancel(listenerFork);
    }
  }
};

export const LISTENER_RESET = createActionType<void>('LISTENERS // RESET');
export const resetListeners = createActionCreator<void>(LISTENER_RESET);

export interface SagaRegistration {
  register(listener: SagaListener<any>): void;
  unregister(listener: SagaListener<any>): void;
}

export function createRegister(dispatch: Dispatch<any>) {
  const listeners = new Set<SagaListener<any>>();
  const sagaRegister: SagaRegistration = {
    register: (listener: SagaListener<any>) => {
      listeners.add(listener);
      dispatch(resetListeners(undefined));
    },
    unregister: (listener: SagaListener<any>) => {
      listeners.delete(listener);
      dispatch(resetListeners(undefined));
    },
  };
  return sagaRegister;
}
