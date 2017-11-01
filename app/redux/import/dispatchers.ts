import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { AddTagsToGalleryPayload, ImportGalleriesPayload } from './types';
import { importGalleries, addTagsToGalleryAndSave, deleteImport, deleteGalleryAndSave } from './actions';

export class ImportDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }

    public importGallery(payload: ImportGalleriesPayload) {
        this.store.dispatch(importGalleries.create(payload));
    }

    public deleteImport(importId: string) {
        this.store.dispatch(deleteImport.create(importId));
    }

    public addTagsToGallery(payload: AddTagsToGalleryPayload) {
        this.store.dispatch(addTagsToGalleryAndSave.create(payload));
    }

    public deleteGallery(payload: string) {
        this.store.dispatch(deleteGalleryAndSave.create(payload));
    }
}