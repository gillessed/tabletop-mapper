import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { performSearch } from './actions';

export class SearchDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }

    public search(query: string) {
        this.store.dispatch(performSearch.create(query));
    }
}