import * as DotProp from 'dot-prop-immutable';
import { Model } from "../model/ModelTypes";

export interface Identifiable {
  id: string;
  name: string;
}

export interface Indexable<T extends Identifiable> {
  byId: { [key: string]: T };
  all: string[];
}

export interface DeleteIndexablePayload {
  id: string;
}

export interface SetNamePayload {
  id: string;
  name: string;
}

export function serializeIndexable<T extends Identifiable>(indexable: Indexable<T>): T[] {
  return indexable.all.map((objectId) => indexable.byId[objectId]);
}

export function deserializeIndexable<T extends Identifiable>(serialized: T[]): Indexable<T> {
  const all: string[] = [];
  const byId: { [id: string]: T } = {};
  for (const object of serialized) {
    all.push(object.id);
    byId[object.id] = object;
  }
  const indexable = { all, byId };
  return indexable;
}

export function createIndexableReducers<State, Payload extends Identifiable>(
  getter: (state: State) => Indexable<Payload>,
  setter: (state: State, indexable: Indexable<Payload>) => State,
) {
  return {
    upsert: createUpsertIndexableReducer(getter, setter),
    remove: createRemoveIndexableReducer(getter, setter),
    setName: createSetIndexableNameReducer(getter, setter),
  }
}

export function createUpsertIndexableReducer<State, Payload extends Identifiable>(
  getter: (state: State) => Indexable<Payload>,
  setter: (state: State, indexable: Indexable<Payload>) => State,
): (state: State, payload: Payload) => State {
  return (state: State, payload: Payload) => {
    const current = getter(state);

    const newById = { ...current.byId };
    newById[payload.id] = payload;
    const newAll = [...current.all];
    const idIndex = current.all.indexOf(payload.id);
    if (idIndex < 0) {
      newAll.push(payload.id);
    }
    const newIndexable = { byId: newById, all: newAll };

    const newState = setter(state, newIndexable);
    return newState;
  };
}

export function createRemoveIndexableReducer<State, I extends Identifiable>(
  getter: (state: State) => Indexable<I>,
  setter: (state: State, indexable: Indexable<I>) => State,
): (state: State, payload: DeleteIndexablePayload) => State {
  return (state: State, { id }) => {
    const current = getter(state);

    const newById = { ...current.byId };
    delete newById[id];
    const newAll = [...current.all];
    const idIndex = current.all.indexOf(id);
    if (idIndex >= 0) {
      newAll.splice(idIndex, 1);
    }
    const newIndexable = { byId: newById, all: newAll };

    const newState = setter(state, newIndexable);
    return newState;
  };
}

export function createSetIndexableNameReducer<State, I extends Identifiable>(
  getter: (state: State) => Indexable<I>,
  setter: (state: State, indexable: Indexable<I>) => State,
): (state: State, payload: SetNamePayload) => State {
  return (state: State, payload: SetNamePayload) => {
    const current = getter(state);
    const object = current.byId[payload.id];

    if (object == null) {
      return state;
    }

    const newById = { ...current.byId, [payload.id]: { ...object, name: payload.name } };
    const newIndexable = { ...current, byId: newById };

    const newState = setter(state, newIndexable);
    return newState;
  };
}
