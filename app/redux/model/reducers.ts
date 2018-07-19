import { Map, Set } from 'immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { TypedAction } from '../utils/typedAction';
import { ModelState } from './types';

const INITIAL_STATE: ModelState = {
    map: 'hi',
};

export const modelReducer: Reducer<ModelState> = newTypedReducer<ModelState>()
    .handleDefault((state = INITIAL_STATE) => state)
    .build();
