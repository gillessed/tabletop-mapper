import { select, takeLatest, put, call } from 'redux-saga/effects';
import { ReduxState } from '../rootReducer';
import { etn } from '../../etn';
import { ConfigPaths } from '../config/types';
import { performSearch, setSearchLoading, setSearchResults } from './actions';
import { TypedAction } from '../utils/typedAction';
import { JannaState, JannaObject, TAG_TYPE_MODEL } from '../model/types';
import { SearchResult } from './types';
import pause from '../../utils/pause';

const ALL_TAGS_QUERY = '{tags}';
const ALL_GALLERIES_QUERY = '{galleries}';
const ALL_UNTAGGED_GALLERIES_QUERY = '{lost}';
const ALL_MODELS_QUERY = '{models}';

export const KeyQueries = {
    allTagsQuery: ALL_TAGS_QUERY,
    allGalleriesQuery: ALL_GALLERIES_QUERY,
    untaggedGalleriesQuery: ALL_UNTAGGED_GALLERIES_QUERY,
    allModelsQuery: ALL_MODELS_QUERY,
}

export function* searchWorker(action: TypedAction<string>) {
    const query = action.payload;
    yield put(setSearchLoading.create({
        query,
        loading: true,
    }));
    const janna: JannaState = yield select((state: ReduxState) => state.janna);
    const results: SearchResult[] = [];
    if (query === ALL_TAGS_QUERY) {
        for (const tag of janna.tags.toArray()) {
            results.push({ objectId: tag.id, matchingTags: [] });
        }
    } else if (query === ALL_GALLERIES_QUERY) {
        for (const gallery of janna.galleries.toArray()) {
            results.push({ objectId: gallery.id, matchingTags: [] });
        }
    } else if (query === ALL_UNTAGGED_GALLERIES_QUERY) {
        for (const gallery of janna.galleries.toArray()) {
            if (!gallery.tags.length) {
                results.push({ objectId: gallery.id, matchingTags: [] });
            }
        }
    } else if (query === ALL_MODELS_QUERY) {
        for (const tag of janna.tags.toArray()) {
            if (tag.tagType === TAG_TYPE_MODEL) {
                results.push({ objectId: tag.id, matchingTags: [] });
            }
        }
    } else {
        for (const tag of janna.tags.toArray()) {
            if (tag.value.toLowerCase() === query) {
                results.push({objectId: tag.id, matchingTags: [] });
            }
        }
        for (const gallery of janna.galleries.toArray()) {
            for (const tagId of gallery.tags) {
                const tag = janna.tags.get(tagId);
                if (tag.value.toLowerCase() === query) {
                    results.push({ objectId: gallery.id, matchingTags: [tagId] });
                }
            }
        }
    }
    yield put(setSearchResults.create({
        query,
        searchResults: results,
    }));
}

export function* searchSaga() {
    yield [
        takeLatest(performSearch.type, searchWorker),
    ]
}