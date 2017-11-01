import { takeLatest, select, put, call, takeEvery, fork } from 'redux-saga/effects';
import { importGalleries, createImport, setImportProgress, addTagsToGalleryAndSave, deleteGalleryAndSave } from './actions';
import { TypedAction } from '../utils/typedAction';
import { ImportGalleryPayload, RunningImport, AddTagsToGalleryPayload, ImportGalleriesPayload } from './types';
import { etn } from '../../etn';
import { ReduxState } from '../rootReducer';
import { JannaGallery } from '../model/types';
import { createGallery, setLocked, addTagsToGallery, deleteGallery } from '../model/actions';
import { serializeModelWorker } from '../model/sagas';
import { copyFile } from '../../utils/copyFile';
import { fileExtension } from '../../utils/fileExtension';
import { zeroPad } from '../../utils/zeroPad';
import { ConfigPaths } from '../config/types';
import { setRoute } from '../navigation/actions';
import { NavRoutes } from '../navigation/types';
import { setGalleryCache } from '../galleryCache/actions';

function* importGalleriesWorker(action: TypedAction<ImportGalleriesPayload>) {
    const galleriesToImport = action.payload;
    // TODO: implement import into existing gallery
    const rootDirectory = yield select((state: ReduxState) => state.config.rootDirectory);
    yield put(setLocked.create(true));
    const galleriesWithFiles = galleriesToImport.map((gallery) => {
        return {
            ...gallery,
            files: etn.fs.readdirSync(gallery.folder).map((image) => etn.path.join(gallery.folder, image)),
        }
    });
    for (const galleryToImport of galleriesWithFiles) {
        yield put(createGallery.create({
            id: galleryToImport.id,
            imageCount: galleryToImport.files.length,
        }));
    }
    yield call(serializeModelWorker);
    yield put(setLocked.create(false));
    for (const galleryToImport of galleriesWithFiles) {
        etn.fs.mkdirSync(ConfigPaths.subDir(galleryToImport.id, rootDirectory));
        yield put(createImport.create({
            images: galleryToImport.files,
            id: galleryToImport.id,
            paused: false,
            progress: 0,
            completed: false,
        }));
        const gallery: JannaGallery = yield select((state: ReduxState) => state.janna.galleries.get(galleryToImport.id));
        yield fork(importGalleryInternal, gallery);
    }
}

function* resumeImportWorker(action: TypedAction<string>) {
    // TODO: implement resume
    yield 2;
}

function* importGalleryInternal(gallery: JannaGallery) {
    const rootDirectory: string = yield select((state: ReduxState) => state.config.rootDirectory);
    const importProgress: RunningImport = yield select((state: ReduxState) => state.import.importMap.get(gallery.id));
    if (!importProgress) {
        console.warn(`Import [${gallery.id}] does not exist.`);
    }
    const galleryDirectory = ConfigPaths.subDir(gallery.id, rootDirectory);
    let paused: boolean = false;
    let index = importProgress.progress;
    const files = [];
    while (!paused && index < importProgress.images.length) {
        const source = importProgress.images[index];
        const extension = fileExtension(source);
        const destinationFilename = `${zeroPad(index + 1, '0', 4)}.${extension}`;
        files.push(destinationFilename);
        const destination = etn.path.join(galleryDirectory, destinationFilename);
        yield call(copyFile, source, destination);
        index++;
        yield put(setImportProgress.create({ id: gallery.id, progress: index }));
        yield put(setGalleryCache.create({
            gallery: gallery.id,
            contents: files,
        }));
    }
}

function* addTagsToGalleryWorker(action: TypedAction<AddTagsToGalleryPayload>) {
    yield put(setLocked.create(true));
    yield put(addTagsToGallery.create(action.payload));
    yield call(serializeModelWorker);
    yield put(setLocked.create(false));
}

function* deleteGalleryWorker(action: TypedAction<string>) {
    const galleryId = action.payload;
    const rootDirectory: string = yield select((state: ReduxState) => state.config.rootDirectory);
    const galleryDirectory = ConfigPaths.subDir(galleryId, rootDirectory);
    yield put(setLocked.create(true));
    const images = etn.fs.readdirSync(galleryDirectory);
    for (const image of images) {
        etn.fs.unlinkSync(etn.path.join(galleryDirectory, image));
    }
    etn.fs.rmdirSync(galleryDirectory);
    yield put(deleteGallery.create(action.payload));
    yield call(serializeModelWorker);
    yield put(setLocked.create(false));
    yield put(setRoute.create({
        navigator: NavRoutes.root._,
        route: NavRoutes.root.home,
    }));
}

export function* importSaga() {
    yield [
        takeEvery(importGalleries.type, importGalleriesWorker),
        takeLatest(addTagsToGalleryAndSave.type, addTagsToGalleryWorker),
        takeLatest(deleteGalleryAndSave.type, deleteGalleryWorker),
    ];
}