import { Store } from 'redux';
import { ReduxState } from './redux/rootReducer';
import { etn } from './etn';
import { JannaState } from './redux/model/types';
import { photoViewPrevious, photoViewNext, closePhotoView } from './redux/photoView/actions';
import { popRoute, forwardRoute } from './redux/navigation/actions';
import { NavRoutes } from './redux/navigation/types';

export function applyMouseNavigationListener(store: Store<ReduxState>) {
    const window = etn.window;
    window.on('app-command', (_, command) => {
        if (command === 'browser-backward') {
            const state: ReduxState = store.getState();
            if (state.photoView) {
                store.dispatch(photoViewPrevious.create(undefined));
            } else {
                store.dispatch(popRoute.create(NavRoutes.root._));
            }
        }
        if (command === 'browser-forward') {
            const state: ReduxState = store.getState();
            if (state.photoView) {
                store.dispatch(photoViewNext.create(undefined));
            } else {
                store.dispatch(forwardRoute.create(NavRoutes.root._));
            }
        }
    });
}

export function applyKeyboardNavigationListener(store: Store<ReduxState>) {
    window.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
            const state: ReduxState = store.getState();
            if (state.photoView) {
                store.dispatch(closePhotoView.create(undefined));
            }
        } else if (e.code === 'ArrowLeft') {
            const state: ReduxState = store.getState();
            if (state.photoView) {
                store.dispatch(photoViewPrevious.create(undefined));
            }
        } else if (e.code === 'ArrowRight') {
            const state: ReduxState = store.getState();
            if (state.photoView) {
                store.dispatch(photoViewPrevious.create(undefined));
            }
        }
    }, true);
}