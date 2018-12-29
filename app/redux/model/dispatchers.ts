import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { SetFeatureTypePayload, UIState } from './types';
import { setFeatureType, updateUIState, createLayer, createFeature, expandNode, collapseNode, selectNode, updateMousePosition } from './actions';
import { createDispatcher, TypedDispatcher } from '../utils/typedDispatcher';

const modelActions = {
    createLayer,
    createFeature,
    setFeatureType,
    expandNode,
    collapseNode,
    selectNode,
};
export type ModelDispatcher = TypedDispatcher<typeof modelActions>;
export function createModelDispatcher(store: Store<ReduxState>): ModelDispatcher {
    return createDispatcher(store, modelActions);
}

const uiActions = {
    updateUIState,
    updateMousePosition,
};
export type UiDispatcher = TypedDispatcher<typeof uiActions>;
export function createUiDispatcher(store: Store<ReduxState>): UiDispatcher {
    return createDispatcher(store, uiActions);
}
