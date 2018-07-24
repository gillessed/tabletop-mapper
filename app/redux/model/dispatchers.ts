import { Store } from 'redux';
import { ReduxState } from '../rootReducer';
import { SetFeatureTypePayload } from './types';
import { setFeatureType } from './actions';
import {
    createLayer,
    createFeature,
    expandNode,
    collapseNode,
    selectNode,
} from './actions';

export class ModelDispatcher {
    constructor(public readonly store: Store<ReduxState>) {}

    public createLayer(parent: string) {
        this.store.dispatch(createLayer.create(parent));
    }

    public createFeature(layerId: string) {
        this.store.dispatch(createFeature.create(layerId));
    }

    public setFeatureType(payload: SetFeatureTypePayload) {
        this.store.dispatch(setFeatureType.create(payload));
    }

    public expandNode(layerId: string) {
        this.store.dispatch(expandNode.create(layerId));
    }

    public collapseNode(layerId: string) {
        this.store.dispatch(collapseNode.create(layerId));
    }
    
    public selectNode(layerId: string | undefined) {
        this.store.dispatch(selectNode.create(layerId));
    }
}