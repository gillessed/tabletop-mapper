export interface NavigationState {
    index: number;
    routeStack: NavigationRoute[];
}

export interface NavigationRoute {
    route: string;
    params?: {[key: string]: any};
}

export interface Navigation {
    routes: { [key: string]: NavigationState };
    importPanelOpen: boolean;
}

export interface SetRoutePayload {
    navigator: string;
    route: string;
    params?: {[key: string]: any};
    resetStack?: boolean;
}

export const NavRoutes = {
    root: {
        _: 'root',
        loading: 'loading',
        home: 'home',
        import: 'import',
        upsertTag: 'upsertTag',
        tag: 'tag',
        search: 'search',
        gallery: 'gallery',
    },
};