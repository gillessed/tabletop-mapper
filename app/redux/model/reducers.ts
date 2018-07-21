import { Map, Set } from 'immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { TypedAction } from '../utils/typedAction';
import { ModelState } from './types';

const INITIAL_STATE: ModelState = {
    layers: {
        byId: {},
        all: [],
    },
    assets: {
        byId: {},
        all: [],
    },
    features: {
        byId: {},
        all: [],
    },
};

export const modelReducer: Reducer<ModelState> = newTypedReducer<ModelState>()
    .handleDefault((state = INITIAL_STATE) => state)
    .build();
