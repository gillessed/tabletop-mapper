import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { saveTag, deleteTagAndSave, removeTagAndSave } from './actions';
import { UpsertTagPayload } from './types';

export class TagDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }

    public saveTag(createTagPayload: UpsertTagPayload) {
        this.store.dispatch(saveTag.create(createTagPayload));
    }

    public deleteTag(tagId: string) {
        this.store.dispatch(deleteTagAndSave.create(tagId));
    }
}