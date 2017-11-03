import { etn } from '../../etn';
import { Config, ConfigPaths, JANNA_COVER_DIRNAME } from '../config/types';
import { put, fork, call } from 'redux-saga/effects';
import { setConfig } from '../config/actions';
import { setRoute } from '../navigation/actions';
import { NavRoutes } from '../../redux/navigation/types';
import { JannaSerializable } from '../model/types';
import { Map, Set } from 'immutable';
import { collectionToMap } from '../../utils/map';
import { jannaLoad } from '../model/actions';
import { readDir, deleteFile, deleteDirectory } from '../../utils/promiseFiles';

export function* initialize() {
    const appDataPath = etn.path.join(etn.app.getPath('appData'), 'janna');
    const homePath = etn.app.getPath('home');
    if (!etn.fs.existsSync(appDataPath)) {
        etn.fs.mkdirSync(appDataPath);
    }
    let config: Config;
    const configPath = etn.path.join(appDataPath, 'janna.json');
    if (!etn.fs.existsSync(configPath)) {
        const folders: string[] = etn.dialog.showOpenDialog({
            title: 'Choose Root Folder',
            defaultPath: homePath,
            properties: ['openDirectory'],
        });
        if (!folders) {
            etn.dialog.showErrorBox('Error', 'You must select a root directory for janna.');
            etn.app.quit();
        }
        config = {
            rootDirectory: folders[0],
        };
        etn.fs.writeFileSync(configPath, JSON.stringify(config));
    } else {
        config = JSON.parse(etn.fs.readFileSync(configPath, 'utf8'));
    }

    const coverDir = ConfigPaths.tagCoverDir(config.rootDirectory!);
    if (!etn.fs.existsSync(coverDir)) {
        etn.fs.mkdirSync(coverDir);
    }

    yield put(setConfig.create(config));

    if (!etn.fs.existsSync(ConfigPaths.dbFile(config.rootDirectory))) {
        const emptyJanna: JannaSerializable = {
            galleries: [],
            tags: [],
        };
        etn.fs.writeFileSync(ConfigPaths.dbFile(config.rootDirectory), JSON.stringify(emptyJanna));
    }
 
    try {
        const rawDbContents = etn.fs.readFileSync(ConfigPaths.dbFile(config.rootDirectory), 'utf-8');
        const jannaDb = JSON.parse(rawDbContents) as JannaSerializable;
        const tagMap = collectionToMap(jannaDb.tags, (tag) => tag.id);
        const galleryMap = collectionToMap(jannaDb.galleries, (gallery) => gallery.id);
        const tagToGalleryMap = Map<string, string[]>().withMutations((mutable) => {
            jannaDb.tags.forEach((tag) => mutable.set(tag.id, []));
        });
        for (const gallery of jannaDb.galleries) {
            for (const tagId of gallery.tags) {
                if (!tagToGalleryMap.get(tagId)) {
                    console.error('TagId is not in map: ' + tagId);
                }
                tagToGalleryMap.get(tagId).push(gallery.id);                
            }
        }
        const tagToGalleryIndex = Map<string, Set<string>>().withMutations((mutable) => {
            tagToGalleryMap.forEach((value: string[], key: string) => {
                mutable.set(key, Set(value));
            });
        });
        yield put(jannaLoad.create({
            tags: tagMap,
            galleries: galleryMap,
            tagToGalleryIndex: tagToGalleryIndex,
        }));
        yield fork(cleanDir, config, jannaDb);
    } catch (e) {
        console.error('Error loading janna data: ' + e.message, e);
        etn.app.quit();
    }

    const route = {
        navigator: 'root',
        route: NavRoutes.root.home,
        resetStack: true,
    }
    yield put(setRoute.create(route));
}

export function* cleanDir(config: Config, jannaDb: JannaSerializable) {
    const galleryAndPhotosetIds = Set<string>().withMutations((mutable) => {
        jannaDb.galleries.forEach((gallery) => {
            mutable.add(gallery.id);
            gallery.photosets.forEach((photoset) => {
                mutable.add(photoset.id);
            })
        });
    });
    const dirContents = yield call(readDir, config.rootDirectory);
    for (const dir of dirContents) {
        const path = etn.path.join(config.rootDirectory, dir);
        if (dir !== JANNA_COVER_DIRNAME && etn.fs.statSync(path).isDirectory() && !galleryAndPhotosetIds.has(dir)) {
            yield call(deleteDirectoryWorker, dir, config.rootDirectory);
        }
    }
}

export function *deleteDirectoryWorker(id: string, rootDirectory: string) {
    const galleryDirectory = ConfigPaths.subDir(id, rootDirectory);
    const images: string[] = yield call(readDir, galleryDirectory);
    for (const image of images) {
        yield call(deleteFile, etn.path.join(galleryDirectory, image));
    }
    yield call(deleteDirectory, galleryDirectory);
}