import { select, takeEvery, put, call } from 'redux-saga/effects';
import { ReduxState } from '../rootReducer';
import { etn } from '../../etn';
import { ConfigPaths } from '../config/types';
import { readGallery, setGalleryCache } from './actions';
import { TypedAction } from '../utils/typedAction';
import { JannaState, JannaObject, TAG_TYPE_MODEL } from '../model/types';
import pause from '../../utils/pause';
import { rootDirectorySelector } from '../config/selectors';
import { ReadGalleryPayload, getCacheId } from './types';
import { jannaSelector } from '../model/selectors';

const lock = new Set<string>();

export function* galleryCacheWorker(action: TypedAction<ReadGalleryPayload>) {
    const { galleryId, photoset } = action.payload;
    const cacheId = getCacheId(galleryId, photoset);
    if (lock.has(cacheId)) {
        return;
    }
    lock.add(cacheId);
    const rootDirectory = yield select(rootDirectorySelector);
    const janna: JannaState = yield select(jannaSelector);
    const gallery = janna.galleries.get(galleryId);
    const photosetId = gallery.photosets[photoset].id;
    const galleryDir = ConfigPaths.subDir(photosetId, rootDirectory);
    const galleryContents = etn.fs.readdirSync(galleryDir);
    yield put(setGalleryCache.create({
        gallery: cacheId,
        contents: galleryContents,
    }));
    lock.delete(cacheId);
}

export function* galleryCacheSaga() {
    yield [
        takeEvery(readGallery.type, galleryCacheWorker),
    ]
}