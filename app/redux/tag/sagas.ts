import { etn } from '../../etn';
import { Config, ConfigPaths } from '../config/types';
import { put, takeLatest, call, select } from 'redux-saga/effects';
import { saveTag, deleteTagAndSave } from './actions';
import { UpsertTagPayload, RemoveTagPayload } from './types';
import { TypedAction } from '../utils/typedAction';
import { createTag, deleteTag, removeTag, saveModel } from '../model/actions';
import { serializeModelWorker } from '../model/sagas';
import { ReduxState } from '../rootReducer';
import { setRoute } from '../navigation/actions';
import { fileExtension } from '../../utils/fileExtension';
import { NavRoutes } from '../navigation/types';
import { JannaTag, JannaState } from '../model/types';
import { copyFile } from '../../utils/promiseFiles';

function* saveTagWorker(action: TypedAction<UpsertTagPayload>) {
    let payload = action.payload;
    const janna: JannaState = yield select((state: ReduxState) => state.janna);
    if (payload.create) {
        const tagWithSameName = janna.tags.toArray()
            .find((tag) => tag.value === action.payload.name);
        if (tagWithSameName) {
            yield put(setRoute.create({
                navigator: NavRoutes.root._,
                route: NavRoutes.root.tag,
                params: {
                    id: tagWithSameName.id,
                },
            }));
            return;
        }
    }

    const oldTag: JannaTag = yield select((state: ReduxState) => state.janna.tags.get(payload.id));
    const rootDirectory: string = yield select((state: ReduxState) => state.config.rootDirectory);
    const coverDirectory = ConfigPaths.tagCoverDir(rootDirectory);
    let sameCoverAsOldTag = false;
    if (oldTag && oldTag.cover && action.payload.cover && action.payload.cover !== oldTag.cover) {
        etn.fs.unlinkSync(etn.path.join(coverDirectory, oldTag.cover));
    } else if (oldTag && oldTag.cover) {
        sameCoverAsOldTag = true;
        payload = {
            ...payload,
            cover: oldTag ? oldTag.cover : undefined,
        };
    }
    if (!sameCoverAsOldTag && payload.cover) {
        const ext = fileExtension(action.payload.cover);
        const newCover = `${action.payload.id}.${ext}`;
        try {
            yield call(copyFile, action.payload.cover, etn.path.join(coverDirectory, newCover));
        } catch (e) {
            console.error('Error copying tag cover.', e);
            return;
        }
        payload = {
            ...payload,
            cover: newCover,
        };
    }
    yield put(createTag.create(payload));
    yield put(saveModel.create(undefined));
    yield put(setRoute.create({
        navigator: NavRoutes.root._,
        route: NavRoutes.root.tag,
        params: {
            id: payload.id,
            page: 0,
        },
    }));
}

function* deleteTagAndSaveWorker(action: TypedAction<string>) {
    let tagId = action.payload;
    const janna: JannaState = yield select((state: ReduxState) => state.janna);

    const tag: JannaTag = yield select((state: ReduxState) => state.janna.tags.get(tagId));
    if (tag.cover) {
        const rootDirectory: string = yield select((state: ReduxState) => state.config.rootDirectory);
        const coverDirectory = ConfigPaths.tagCoverDir(rootDirectory);
        const cover = etn.path.join(coverDirectory, tag.cover);
        etn.fs.unlinkSync(cover);
    }
    yield put(deleteTag.create(tagId));
    yield put(saveModel.create(undefined));
    yield put(setRoute.create({
        navigator: NavRoutes.root._,
        route: NavRoutes.root.home,
    }));
}

export function *tagSaga() {
    yield [
        takeLatest(saveTag.type, saveTagWorker),
        takeLatest(deleteTagAndSave.type, deleteTagAndSaveWorker),
    ];
}