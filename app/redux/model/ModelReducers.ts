import * as DotProp from 'dot-prop-immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { Model } from './ModelTypes';
import { findByName } from "./ModelUtils";

const INITIAL_STATE: Model.Types.State = {
  layers: {
    byId: {
      [Model.RootLayerId]: {
        id: Model.RootLayerId,
        name: 'Root',
        parent: null,
        visible: true,
        children: [],
        features: [],
      }
    },
    all: [ Model.RootLayerId],
  },
  assets: {
    byId: {},
    all: [],
  },
  features: {
    byId: {},
    all: [],
  },
  styles: {
    byId: {},
    all: [],
  },
};

const INITIAL_STATE2: Model.Types.State = {
  ...INITIAL_STATE,
  layers: {
    byId: {
      [Model.RootLayerId]: {
        id: Model.RootLayerId,
        name: 'Root',
        parent: null,
        visible: true,
        children: ['1', '2'],
        features: [],
      },
      '1': {
        id: '1',
        name: 'Layer 1',
        parent: Model.RootLayerId,
        visible: true,
        children: [],
        features: [],
      },
      '2': {
        id: '2',
        name: 'Layer 2',
        parent: Model.RootLayerId,
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

export const createFeatureReducer = (state: Model.Types.State, feature: Model.Types.Feature) => {
  let newState = state;
  newState = DotProp.merge(newState, `layers.byId.${feature.layerId}.features`, [feature.id]);
  newState = DotProp.set(newState, `features.byId.${feature.id}`, feature);
  newState = DotProp.merge(newState, `features.all`, [feature.id]);

  return newState;
}

export const modelReducer: Reducer<Model.Types.State> = newTypedReducer<Model.Types.State>()
  .handlePayload(Model.Actions.createLayer.type, createLayerHandler)
  .handlePayload(Model.Actions.createFeature.type, createFeatureReducer)
  .handleDefault((state = INITIAL_STATE2) => state)
  .build();
