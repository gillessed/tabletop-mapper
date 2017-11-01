import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { OpenPhotoViewPayload } from './types';
import { openPhotoView, closePhotoView, photoViewNext, photoViewPrevious } from './actions';

export class PhotoViewDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }

    public openPhotoView(payload: OpenPhotoViewPayload) {
        this.store.dispatch(openPhotoView.create(payload));
    }

    public closePhotoView() {
        this.store.dispatch(closePhotoView.create(undefined));
    }

    public next() {
        this.store.dispatch(photoViewNext.create(undefined));
    }

    public previous() {
        this.store.dispatch(photoViewPrevious.create(undefined));
    }
}