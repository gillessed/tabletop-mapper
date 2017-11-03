import { takeLatest, select, put, call, takeEvery, fork } from 'redux-saga/effects';
import { importGalleries, createImport, setImportProgress, addTagsToGalleryAndSave, deleteGalleryAndSave, importPhotoset } from './actions';
import { TypedAction } from '../utils/typedAction';
import { ImportGalleryPayload, RunningImport, AddTagsToGalleryPayload, ImportGalleriesPayload, ImportPhotosetPayload } from './types';
import { etn } from '../../etn';
import { ReduxState } from '../rootReducer';
import { JannaGallery, RenamePhotosetPayload } from '../model/types';
import { createGallery, addTagsToGallery, deleteGallery, createPhotoset, renamePhotoset, saveModel } from '../model/actions';
import { serializeModelWorker } from '../model/sagas';
import { fileExtension } from '../../utils/fileExtension';
import { zeroPad } from '../../utils/zeroPad';
import { ConfigPaths } from '../config/types';
import { setRoute } from '../navigation/actions';
import { NavRoutes } from '../navigation/types';
import { setGalleryCache } from '../galleryCache/actions';
import { generateRandomString } from '../../utils/randomId';
import { copyFile } from '../../utils/promiseFiles';

function* importGalleriesWorker(action: TypedAction<ImportGalleriesPayload>) {
    const galleriesToImport = action.payload;
    const rootDirectory = yield select((state: ReduxState) => state.config.rootDirectory);
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
    yield put(saveModel.create(undefined));
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
        yield fork(importGalleryInternal, gallery, 0);
    }
}

function* importPhotosetWorker(action: TypedAction<ImportPhotosetPayload>) {
    const payload = action.payload;
    const rootDirectory = yield select((state: ReduxState) => state.config.rootDirectory);
    const gallery: JannaGallery = yield select((state: ReduxState) => state.janna.galleries.get(payload.galleryId));
    if (!gallery) {
        return;
    }
    const images = etn.fs.readdirSync(payload.folder).map((filename) => {
        return etn.path.join(payload.folder, filename);  
    });
    const imageCount = images.length;
    if (imageCount === 0) {
        return;
    }
    const photosetId = generateRandomString();
    yield put(createPhotoset.create({
        galleryId: gallery.id,
        id: photosetId,
        imageCount,
    }))
    yield put(saveModel.create(undefined));
    yield put(createImport.create({
        images,
        id: photosetId,
        paused: false,
        progress: 0,
        completed: false,
    }));
    const newGallery: JannaGallery = yield select((state: ReduxState) => state.janna.galleries.get(payload.galleryId));
    const photosetIndex = newGallery.photosets.length - 1;
    etn.fs.mkdirSync(ConfigPaths.subDir(photosetId, rootDirectory));
    yield fork(importGalleryInternal, newGallery, photosetIndex);
}

function* importGalleryInternal(gallery: JannaGallery, photosetIndex: number) {
    const rootDirectory: string = yield select((state: ReduxState) => state.config.rootDirectory);
    const photoset = gallery.photosets[photosetIndex];
    const importProgress: RunningImport = yield select((state: ReduxState) => {
        return state.import.importMap.get(photoset.id);
    });
    if (!importProgress) {
        console.warn(`Import [${photoset.id}] does not exist.`);
        return;
    }
    const galleryDirectory = ConfigPaths.subDir(photoset.id, rootDirectory);
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
        yield put(setImportProgress.create({ id: gallery.photosets[photosetIndex].id, progress: index }));
        yield put(setGalleryCache.create({
            gallery: gallery.id,
            contents: files,
        }));
    }
}

function* deleteGalleryWorker(action: TypedAction<string>) {
    const galleryId = action.payload;
    const rootDirectory: string = yield select((state: ReduxState) => state.config.rootDirectory);
    yield put(deleteGallery.create(action.payload));
    yield put(saveModel.create(undefined));
    yield put(setRoute.create({
        navigator: NavRoutes.root._,
        route: NavRoutes.root.home,
    }));
}

export function* importSaga() {
    yield [
        takeEvery(importGalleries.type, importGalleriesWorker),
        takeEvery(importPhotoset.type, importPhotosetWorker),
        takeLatest(deleteGalleryAndSave.type, deleteGalleryWorker),
    ];
}