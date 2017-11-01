import { select, takeEvery, put, call } from 'redux-saga/effects';
import { ReduxState } from '../rootReducer';
import { etn } from '../../etn';
import { ConfigPaths } from '../config/types';
import { readGallery, setGalleryCache } from './actions';
import { TypedAction } from '../utils/typedAction';
import { JannaState, JannaObject, TAG_TYPE_MODEL } from '../model/types';
import pause from '../../utils/pause';
import { rootDirectorySelector } from '../config/selectors';

const lock = new Set<string>();

export function* galleryCacheWorker(action: TypedAction<string>) {
    const galleryId = action.payload;
    if (lock.has(galleryId)) {
        return;
    }
    lock.add(galleryId);
    const rootDirectory = yield select(rootDirectorySelector);
    const galleryDir = ConfigPaths.subDir(galleryId, rootDirectory);
    const galleryContents = etn.fs.readdirSync(galleryDir);
    yield put(setGalleryCache.create({
        gallery: galleryId,
        contents: galleryContents,
    }));
    lock.delete(galleryId);
}

export function* galleryCacheSaga() {
    yield [
        takeEvery(readGallery.type, galleryCacheWorker),
    ]
}