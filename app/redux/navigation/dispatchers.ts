import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { setRoute, popRoute, toggleImportPanel, forwardRoute } from './actions';

export class NavigationDispatcher {
    constructor(public readonly store: Store<ReduxState>) { }

    public setRoute(navigator: string, route: string, params?: { [key: string]: any }) {
        this.store.dispatch(setRoute.create({ navigator, route, params }));
    }

    public popRoute(navigator: string) {
        this.store.dispatch(popRoute.create(navigator));
    }

    public forwardRoute(navigator: string) {
        this.store.dispatch(forwardRoute.create(navigator));
    }

    public toggleImportPanel(open?: boolean) {
        this.store.dispatch(toggleImportPanel.create(open));
    }
}