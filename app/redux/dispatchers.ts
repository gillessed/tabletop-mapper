import { Store } from 'redux';
import { ReduxState } from './rootReducer';
import { ModelDispatcher, GridDispatcher, createModelDispatcher, createUiDispatcher } from './model/dispatchers';

export interface Dispatchers {
    model: ModelDispatcher;
    grid: GridDispatcher;
}

export const dispatcherCreators = (store: Store<ReduxState>): Dispatchers => {
    return {
        model: createModelDispatcher(store),
        grid: createUiDispatcher(store),
    };
};