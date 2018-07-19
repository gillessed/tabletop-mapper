import { Store } from 'redux';
import { ReduxState } from './rootReducer';
import { ModelDispatcher } from './model/dispatchers';

export interface Dispatchers {
    model: ModelDispatcher;
}

export const dispatcherCreators = (store: Store<ReduxState>): Dispatchers => {
    return {
        model: new ModelDispatcher(store),
    };
};