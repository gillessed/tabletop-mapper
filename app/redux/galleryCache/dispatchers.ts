import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { readGallery } from './actions';

export class GalleryCacheDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }

    public read(galleryId: string) {
        this.store.dispatch(readGallery.create(galleryId));
    }
}