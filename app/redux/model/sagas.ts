import { select, put, call, takeLatest } from 'redux-saga/effects';
import { ReduxState } from '../rootReducer';
import { JannaState, JannaSerializable, RenamePhotosetPayload, DeletePhotosetPayload } from './types';
import { etn } from '../../etn';
import { ConfigPaths } from '../config/types';
import { TypedAction } from '../utils/typedAction';
import { setLocked, deletePhotoset, renamePhotoset, saveModel, addTagsToGallery, removeTag } from './actions';
import { writeFile } from '../../utils/promiseFiles';

let writing = false;
let shouldWrite = false;

export function* serializeModelWorker() {
    if (writing) {
        shouldWrite = true;
        return;
    }
    writing = true;
    yield put(setLocked.create(true));
    const rootDirectory = yield select((state: ReduxState) => state.config.rootDirectory);
    const janna: JannaState = yield select((state: ReduxState) => state.janna);
    const jannaSerialize: JannaSerializable = {
        galleries: janna.galleries.toArray(),
        tags: janna.tags.toArray(),
    };
    const filename = ConfigPaths.dbFile(rootDirectory)
    const data = JSON.stringify(jannaSerialize, null, 2);
    yield call(writeFile, filename, data);
    yield put(setLocked.create(false));
    writing = false;
    if (shouldWrite) {
        shouldWrite = false;
        yield put(saveModel.create(undefined));
    }
}

export function *modelSaga() {
    yield [
        takeLatest(saveModel.type, serializeModelWorker),
        takeLatest(addTagsToGallery.type, serializeModelWorker),
        takeLatest(removeTag.type, serializeModelWorker),
        takeLatest(renamePhotoset.type, serializeModelWorker),
        takeLatest(deletePhotoset.type, serializeModelWorker),
    ]
}