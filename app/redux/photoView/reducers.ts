import { Map } from 'immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { TypedAction } from '../utils/typedAction';
import { openPhotoView, closePhotoView, photoViewNext, photoViewPrevious } from './actions';
import { JannaObject } from '../model/types';
import { PhotoViewState, OpenPhotoViewPayload } from './types';

const INITIAL_STATE: PhotoViewState = false;

const openPhotoViewReducer = (state: PhotoViewState, action: TypedAction<OpenPhotoViewPayload>) => {
    return action.payload;
}

const photoViewNextReducer = (state: PhotoViewState) => {
    if (state === false) {
        return state;
    }
    return {
        ...state,
        index: (state.index + 1) % state.images.length,
    };
}

const photoViewPreviousReducer = (state: PhotoViewState) => {
    if (state === false) {
        return state;
    }
    return {
        ...state,
        index: (state.index + state.images.length - 1) % state.images.length,
    };
}

export const photoViewReducer: Reducer<PhotoViewState> = newTypedReducer<PhotoViewState>()
    .handle(openPhotoView.type, openPhotoViewReducer)
    .handle(closePhotoView.type, () => INITIAL_STATE)
    .handle(photoViewNext.type, photoViewNextReducer)
    .handle(photoViewPrevious.type, photoViewPreviousReducer)
    .handleDefault((state = INITIAL_STATE) => state)
    .build();