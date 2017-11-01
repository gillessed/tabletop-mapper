import { newTypedReducer } from '../utils/typedReducer';
import { Config } from './types';
import { TypedAction } from '../utils/typedAction';
import { Reducer } from 'redux';
import { setConfig } from './actions';

const INITIAL_STATE: Config = {};

const setConfigReducer = (state: Config, action: TypedAction<Config>) => {
    const { payload } = action;
    return payload;
}

export const configReducer: Reducer<Config> = newTypedReducer<Config>()
    .handle(setConfig.type, setConfigReducer)
    .handleDefault((state = INITIAL_STATE) => state)
    .build();