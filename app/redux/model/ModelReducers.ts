import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import * as DotProp from 'dot-prop-immutable';
import { findByName } from "./ModelUtils";
import { Model } from './ModelTypes';

const INITIAL_STATE: Model.Types.State = {
    layers: {
        byId: {
            'root-layer': {
                id: 'root-layer',
                name: 'Root',
                parent: null,
                visible: true,
                children: [],
                features: [],
            }
        },
        all: ['root-layer'],
    },
    assets: {
        byId: {},
        all: [],
    },
    features: {
        byId: {},
        all: [],
    },
};

const INITIAL_STATE2: Model.Types.State = {
    ...INITIAL_STATE,
    layers: {
        byId: {
            [Model.ROOT_LAYER]: {
                id: Model.ROOT_LAYER,
                name: 'Root',
                parent: null,
                visible: true,
                children: ['1', '2'],
                features: [],
            },
            '1': {
                id: '1',
                name: 'Layer 1',
                parent: Model.ROOT_LAYER,
                visible: true,
                children: [],
                features: [],
            },
            '2': {
                id: '2',
                name: 'Layer 2',
                parent: Model.ROOT_LAYER,
                visible: true,
                children: [],
                features: [],
            }
        },
        all: ['root-layer', '1', '2'],
    },
};

const createLayerHandler = (state: Model.Types.State, payload: Model.Payloads.CreateLayer) => {
    let index = 1;
    while (findByName(state.layers, `Layer ${index}`)) {
        index++;
    }
    const newLayer: Model.Types.Layer = {
        id: payload.layerId,
        visible: true,
        parent: payload.parentId,
        name: `Layer ${index}`,
        children: [],
        features: [],
    };

    let newState = state;
    newState = DotProp.merge(newState, `layers.byId.${payload.parentId}.children`, [newLayer.id]);
    newState = DotProp.set(newState, `layers.byId.${newLayer.id}`, newLayer);
    newState = DotProp.merge(newState, `layers.all`, [newLayer.id]);

    return newState;
}

export const createFeatureReducer = (state: Model.Types.State, payload: Model.Payloads.CreateFeature) => {
    let index = 1;
    while (findByName(state.features, `Feature ${index}`)) {
        index++;
    }

    const newFeature = {
        id: payload.featureId,
        layer: payload.layerId,
        name: `Feature ${index}`,
        type: 'point',
    };

    let newState = state;
    newState = DotProp.merge(newState, `layers.byId.${payload.layerId}.features`, [newFeature.id]);
    newState = DotProp.set(newState, `features.byId.${newFeature.id}`, newFeature);
    newState = DotProp.merge(newState, `features.all`, [newFeature.id]);

    return newState;
}

const setFeatureTypeReducer = (state: Model.Types.State, payload: Model.Payloads.SetFeatureType) => {
    let newState = state;
    newState = DotProp.set(state, `features.byId.${payload.featureId}.type`, payload.type);
    newState = DotProp.delete(newState, `features.byId.${payload.featureId}.geometry`);
    return newState;
}

export const modelReducer: Reducer<Model.Types.State> = newTypedReducer<Model.Types.State>()
    .handlePayload(Model.Actions.createLayer.type, createLayerHandler)
    .handlePayload(Model.Actions.createFeature.type, createFeatureReducer)
    .handlePayload(Model.Actions.setFeatureType.type, setFeatureTypeReducer)
    .handleDefault((state = INITIAL_STATE2) => state)
    .build();
