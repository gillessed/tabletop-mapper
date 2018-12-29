import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { SetFeatureTypePayload, GridState } from './types';
import { setFeatureType, updateGridState, createLayer, createFeature, expandNode, collapseNode, selectNode } from './actions';
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

const gridActions = {
    updateGridState,
};
export type GridDispatcher = TypedDispatcher<typeof gridActions>;
export function createUiDispatcher(store: Store<ReduxState>): GridDispatcher {
    return createDispatcher(store, gridActions);
}
