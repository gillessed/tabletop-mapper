import { Store } from 'redux';
import { ReduxState } from './rootReducer';
import { NavigationDispatcher } from './navigation/dispatchers';
import { ConfigDispatcher } from './config/dispatchers';
import { ImportDispatcher } from './import/dispatchers';
import { TagDispatcher } from './tag/dispatchers';
import { SearchDispatcher } from './search/dispatchers';
import { PhotoViewDispatcher } from './photoView/dispatchers';
import { GalleryCacheDispatcher } from './galleryCache/dispatchers';
import { ModelDispatcher } from './model/dispatchers';

export interface Dispatchers {
    navigation: NavigationDispatcher;
    config: ConfigDispatcher;
    import: ImportDispatcher;
    model: ModelDispatcher;
    tag: TagDispatcher;
    search: SearchDispatcher;
    photoView: PhotoViewDispatcher;
    galleryCache: GalleryCacheDispatcher;
}

export const dispatcherCreators = (store: Store<ReduxState>): Dispatchers => {
    return {
        navigation: new NavigationDispatcher(store),
        config: new ConfigDispatcher(store),
        import: new ImportDispatcher(store),
        model: new ModelDispatcher(store),
        tag: new TagDispatcher(store),
        search: new SearchDispatcher(store),
        photoView: new PhotoViewDispatcher(store),
        galleryCache: new GalleryCacheDispatcher(store),
    };
};