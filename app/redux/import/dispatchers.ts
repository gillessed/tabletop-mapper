import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { AddTagsToGalleryPayload, ImportGalleriesPayload, ImportPhotosetPayload } from './types';
import { importGalleries, addTagsToGalleryAndSave, deleteImport, deleteGalleryAndSave, importPhotoset } from './actions';
import { RenamePhotosetPayload, DeletePhotosetPayload } from '../model/types';

export class ImportDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }

    public importGallery(payload: ImportGalleriesPayload) {
        this.store.dispatch(importGalleries.create(payload));
    }

    public importPhotoset(payload: ImportPhotosetPayload) {
        this.store.dispatch(importPhotoset.create(payload));
    }

    public deleteImport(importId: string) {
        this.store.dispatch(deleteImport.create(importId));
    }

    public deleteGallery(payload: string) {
        this.store.dispatch(deleteGalleryAndSave.create(payload));
    }
}