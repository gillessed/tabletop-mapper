import { Store } from 'redux';
import { ReduxState } from './rootReducer';
import { ModelDispatcher, UiDispatcher, createModelDispatcher, createUiDispatcher } from './model/dispatchers';

export interface Dispatchers {
    model: ModelDispatcher;
    ui: UiDispatcher;
}

export const dispatcherCreators = (store: Store<ReduxState>): Dispatchers => {
    return {
        model: createModelDispatcher(store),
        ui: createUiDispatcher(store),
    };
};