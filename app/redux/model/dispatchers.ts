import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { RenamePhotosetPayload, DeletePhotosetPayload } from '../model/types';
import { renamePhotoset, deletePhotoset, addTagsToGallery, removeTag } from './actions';
import { AddTagsToGalleryPayload } from '../import/types';

export class ModelDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }

    public addTagsToGallery(payload: AddTagsToGalleryPayload) {
        this.store.dispatch(addTagsToGallery.create(payload));
    }

    public removeTag(tagId: string, galleryId: string) {
        this.store.dispatch(removeTag.create({ tagId, galleryId }));
    }

    public renamePhotoset(payload: RenamePhotosetPayload) {
        this.store.dispatch(renamePhotoset.create(payload));
    }

    public deletePhotoset(payload: DeletePhotosetPayload) {
        this.store.dispatch(deletePhotoset.create(payload));
    }
}