import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { ModelState, Layer, ROOT_LAYER, Feature, Indexable, ModelObject, SetFeatureTypePayload, GridState, MouseMode } from './types';
import { createLayer, createFeature, expandNode, collapseNode, selectNode, setFeatureType, updateGridState } from './actions';
import { generateRandomString } from '../../utils/randomId';
import * as DotProp from 'dot-prop-immutable';
import { Transform, Vector } from '../../math/transform';

const INITIAL_STATE: ModelState = {
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
    expandedNodes: {
        [ROOT_LAYER]: true,
    },
    selectedNode: ROOT_LAYER,
    grid: {
        mouseMode: MouseMode.NONE,
        transform: new Transform(new Vector(1, 1), 1),
    },
};

const INITIAL_STATE2: ModelState = {
    ...INITIAL_STATE,
    layers: {
        byId: {
            [ROOT_LAYER]: {
                id: ROOT_LAYER,
                name: 'Root',
                parent: null,
                visible: true,
                children: ['1', '2'],
                features: [],
            },
            '1': {
                id: '1',
                name: 'Layer 1',
                parent: ROOT_LAYER,
                visible: true,
                children: [],
                features: [],
            },
            '2': {
                id: '2',
                name: 'Layer 2',
                parent: ROOT_LAYER,
                visible: true,
                children: [],
                features: [],
            }
        },
        all: ['root-layer', '1', '2'],
    },
};

const createLayerHandler = (state: ModelState, parent: string) => {
    let index = 1;
    while (findByName(state.layers, `Layer ${index}`)) {
        index++;
    }
    const newLayer: Layer = {
        id: generateRandomString(),
        visible: true,
        parent,
        name: `Layer ${index}`,
        children: [],
        features: [],
    };

    let newState = state;
    newState = expandNodeReducer(newState, parent);
    newState = selectNodeReducer(newState, newLayer.id);
    newState = DotProp.merge(newState, `layers.byId.${parent}.children`, [newLayer.id]);
    newState = DotProp.set(newState, `layers.byId.${newLayer.id}`, newLayer);
    newState = DotProp.merge(newState, `layers.all`, [newLayer.id]);

    return newState;
}

export const createFeatureReducer = (state: ModelState, layerId: string) => {
    let index = 1;
    while (findByName(state.features, `Feature ${index}`)) {
        index++;
    }

    const newFeature = {
        id: generateRandomString(),
        layer: layerId,
        name: `Feature ${index}`,
        type: 'point',
    };

    let newState = state;
    newState = expandNodeReducer(newState, layerId);
    newState = selectNodeReducer(newState, newFeature.id);
    newState = DotProp.merge(newState, `layers.byId.${layerId}.features`, [newFeature.id]);
    newState = DotProp.set(newState, `features.byId.${newFeature.id}`, newFeature);
    newState = DotProp.merge(newState, `features.all`, [newFeature.id]);

    return newState;
}

const setFeatureTypeReducer = (state: ModelState, payload: SetFeatureTypePayload) => {
    let newState = state;
    newState = DotProp.set(state, `features.byId.${payload.featureId}.type`, payload.type);
    newState = DotProp.delete(state, `features.byId.${payload.featureId}.geometry`);
    return newState;
}

const expandNodeReducer = (state: ModelState, layerId: string) => {
    let expandedNodes: { [key:string]: boolean } = {
        [layerId]: true,
    };
    let node = state.layers.byId[layerId];
    while (node.parent !== null) {
        node = state.layers.byId[node.parent];
        expandedNodes = {
            ...expandedNodes,
            [node.id]: true,
        };
    }
    return {
        ...state,
        expandedNodes: {
            ...state.expandedNodes,
            ...expandedNodes,
        }
    };
}

const collapseNodeReducer = (state: ModelState, layerId: string) => {
    return {
        ...state,
        expandedNodes: {
            ...state.expandedNodes,
            [layerId]: false,
        }
    };
}

const selectNodeReducer = (state: ModelState, layerId: string) => {
    return {
        ...state,
        selectedNode: layerId,
    };
}

const gridStateReducer = (state: ModelState, payload: Partial<GridState>) => {
    return {
        ...state,
        grid: { ...state.grid, ...payload },
    };
}

const mousePositionReducer = (state: ModelState, payload: Vector) => {
    return { ...state, mousePosition: payload };
}

export const modelReducer: Reducer<ModelState> = newTypedReducer<ModelState>()
    .handlePayload(createLayer.type, createLayerHandler)
    .handlePayload(createFeature.type, createFeatureReducer)
    .handlePayload(setFeatureType.type, setFeatureTypeReducer)
    .handlePayload(expandNode.type, expandNodeReducer)
    .handlePayload(collapseNode.type, collapseNodeReducer)
    .handlePayload(selectNode.type, selectNodeReducer)
    .handlePayload(updateGridState.type, gridStateReducer)
    .handleDefault((state = INITIAL_STATE2) => state)
    .build();

const findByName = <T extends ModelObject>(index: Indexable<T>, name: string) => {
    return index.all.find((id: string) => {
        if (index.byId[id].name === name) {
            return true;
        }
        return false;
    });
}
