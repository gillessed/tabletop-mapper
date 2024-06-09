import { useStore } from "react-redux";
import { Store } from "redux";
import { ReduxState } from "../AppReducer";

export type StoreWorker2<R, A1, A2> = (
  store: Store<ReduxState>,
  a1: A1,
  a2: A2
) => Promise<R>;
export type StoreWorker1<R, A1> = (
  store: Store<ReduxState>,
  a1: A1
) => Promise<R>;
export type StoreWorker0<R> = (store: Store<ReduxState>) => Promise<R>;

export function useWorker<R>(worker: StoreWorker0<R>): () => Promise<R>;
export function useWorker<R, A1>(
  worker: StoreWorker1<R, A1>
): (a1: A1) => Promise<R>;
export function useWorker<R, A1, A2>(
  worker: StoreWorker2<R, A1, A2>
): (a1: A1, a2: A2) => Promise<R>;
export function useWorker<R, A1, A2, A3>(
  worker: (store: Store<ReduxState>, a1: A1, a2: A2, a3: A3) => Promise<R>
): (a1: A1, a2: A2, a3: A3) => Promise<R>;
export function useWorker<R>(
  worker: (store: Store<ReduxState>, ...args: any[]) => Promise<R>
): (...args: any[]) => Promise<R> {
  const store = useStore<ReduxState>();
  return (...args: any[]) => {
    return worker(store, ...args);
  };
}
