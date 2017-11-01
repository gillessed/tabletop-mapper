import { combineReducers } from 'redux';
import { navigationReducer } from './navigation/reducers';
import { Navigation } from './navigation/types';
import { Config } from './config/types';
import { configReducer } from './config/reducers';
import { JannaState } from './model/types';
import { jannaReducer } from './model/reducers';
import { ImportState } from './import/types';
import { importReducer } from './import/reducers';
import { SearchState } from './search/types';
import { searchReducer } from './search/reducers';
import { PhotoViewState } from './photoView/types';
import { photoViewReducer } from './photoView/reducers';
import { GalleryCacheState } from './galleryCache/types';
import { galleryCacheReducer } from './galleryCache/reducers';

export interface ReduxState {
    navigation: Navigation;
    config: Config;
    janna: JannaState;
    import: ImportState;
    search: SearchState;
    photoView: PhotoViewState;
    galleryCache: GalleryCacheState;
}

export const rootReducer = combineReducers<ReduxState>({
    navigation: navigationReducer,
    config: configReducer,
    janna: jannaReducer,
    import: importReducer,
    search: searchReducer,
    photoView: photoViewReducer,
    galleryCache: galleryCacheReducer,
});