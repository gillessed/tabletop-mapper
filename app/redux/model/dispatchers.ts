import { Store } from 'redux';
import { ReduxState } from '../rootReducer';

export class ModelDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }
}