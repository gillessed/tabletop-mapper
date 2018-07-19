import { Store } from 'redux';
import { ReduxState } from './redux/rootReducer';
import { etn } from './etn';

export function applyMouseNavigationListener(store: Store<ReduxState>) {
    const window = etn.window;
    window.on('app-command', (_, command) => {
        if (command === 'browser-backward') {
        }
        if (command === 'browser-forward') {
        }
    });
}

export function applyKeyboardNavigationListener(store: Store<ReduxState>) {
    window.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
        } else if (e.code === 'ArrowLeft') {
        } else if (e.code === 'ArrowRight') {
        }
    }, true);
}