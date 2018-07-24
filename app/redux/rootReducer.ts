import { combineReducers } from 'redux';
import { ModelState } from './model/types';
import { modelReducer } from './model/reducers';

export interface ReduxState {
    model: ModelState;
}

export const rootReducer = combineReducers<ReduxState>({
    model: modelReducer,
});