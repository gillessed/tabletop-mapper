import { newTypedReducer } from '../utils/typedReducer';
import { setRoute, popRoute, toggleImportPanel, forwardRoute } from './actions';
import { SetRoutePayload, NavRoutes, Navigation, NavigationRoute, NavigationState } from './types';
import { TypedAction } from '../utils/typedAction';
import { Reducer } from 'redux';

const INITIAL_STATE: Navigation = {
    routes: {
        root: {
            index: 0,
            routeStack: [{
                route: NavRoutes.root.loading,
            }],
        },
    },
    importPanelOpen: false,
};

const setRouteReducer = (state: Navigation, action: TypedAction<SetRoutePayload>) => {
    const { payload } = action;
    const navigationState = state.routes[payload.navigator];
    const navigationStack = navigationState.routeStack;
    let newNavigator: NavigationRoute[];
    let index: number;
    if (!action.payload.resetStack) {
        newNavigator = [...navigationStack.slice(0, navigationState.index + 1), { route: payload.route, params: payload.params }];
        index = newNavigator.length - 1;
        if (newNavigator.length > 50) {
            index--;
            newNavigator.shift();
        }
    } else {
        newNavigator = [{ route: payload.route, params: payload.params }];
        index = 0;
    }
    return {
        ...state,
        routes: {
            ...state.routes,
            [payload.navigator]: {
                index,
                routeStack: newNavigator,
            },
        },
    };
}

const popRouteReducer = (state: Navigation, action: TypedAction<string>) => {
    const navigatorName = action.payload;
    const navigationState = state.routes[navigatorName];
    const newNavigationState: NavigationState = {
        index: Math.max(navigationState.index - 1, 0),
        routeStack: navigationState.routeStack,
    };
    return {
        ...state,
        routes: {
            ...state.routes,
            [navigatorName]: newNavigationState,
        },
    };
}

const forwardRouteReducer = (state: Navigation, action: TypedAction<string>) => {
    const navigatorName = action.payload;
    const navigationState = state.routes[navigatorName];
    const newNavigationState: NavigationState = {
        index: Math.min(navigationState.index + 1, navigationState.routeStack.length - 1),
        routeStack: navigationState.routeStack,
    };
    return {
        ...state,
        routes: {
            ...state.routes,
            [navigatorName]: newNavigationState,
        },
    };
}

const toggleImportPanelReducer = (state: Navigation, action: TypedAction<boolean | undefined>) => {
    let open = action.payload;
    if (open === undefined) {
        open = !state.importPanelOpen;
    }
    return {
        ...state,
        importPanelOpen: action.payload,
    };
}

export const navigationReducer: Reducer<Navigation> = newTypedReducer<Navigation>()
    .handle(setRoute.type, setRouteReducer)
    .handle(popRoute.type, popRouteReducer)
    .handle(forwardRoute.type, forwardRouteReducer)
    .handle(toggleImportPanel.type, toggleImportPanelReducer)
    .handleDefault((state = INITIAL_STATE) => state)
    .build();