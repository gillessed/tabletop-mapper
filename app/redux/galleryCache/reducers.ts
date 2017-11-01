import { GalleryCacheState, SetGalleryCachePayload } from './types';
import { Map } from 'immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { TypedAction } from '../utils/typedAction';
import { JannaObject } from '../model/types';
import { setGalleryCache } from './actions';

const INITIAL_STATE: GalleryCacheState = Map();

const setReducer = (state: GalleryCacheState, action: TypedAction<SetGalleryCachePayload>) => {
    return state.withMutations((mutable) => {
        mutable.set(action.payload.gallery, action.payload.contents);
    });
}

export const galleryCacheReducer: Reducer<GalleryCacheState> = newTypedReducer<GalleryCacheState>()
    .handle(setGalleryCache.type, setReducer)
    .handleDefault((state = INITIAL_STATE) => state)
    .build();