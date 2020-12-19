import * as DotProp from 'dot-prop-immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { Model } from './ModelTypes';
import { findByName } from "./ModelUtils";
import { DefaultSvgStyle, DefaultBasicAssetStyle } from './DefaultStyles';
import { translateFeature } from './FeatureTranslation';

const InitialState: Model.Types.State = {
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
    byId: { 
      [DefaultSvgStyle.id]: DefaultSvgStyle,
      [DefaultBasicAssetStyle.id]: DefaultBasicAssetStyle,
    },
    all: [DefaultSvgStyle.id, DefaultBasicAssetStyle.id],
  },
};

const INITIAL_STATE2: Model.Types.State = {
  ...InitialState,
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

const createLayerReducer = (state: Model.Types.State, payload: Model.Payloads.CreateLayer): Model.Types.State => {
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

const createFeatureReducer = (state: Model.Types.State, feature: Model.Types.Feature): Model.Types.State => {
  let newState = state;
  newState = DotProp.merge(newState, `layers.byId.${feature.layerId}.features`, [feature.id]);
  newState = DotProp.set(newState, `features.byId.${feature.id}`, feature);
  newState = DotProp.merge(newState, `features.all`, [feature.id]);
  return newState;
}

const translateFeaturesReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.TranslateFeatures,
): Model.Types.State => {
  const { featureIds, translation } = payload;
  let newState = state;
  for (const featureId of featureIds) {
    const feature = state.features.byId[featureId];
    const translatedFeature = translateFeature(feature, translation);
    newState = DotProp.set(newState, `features.byId.${feature.id}`, translatedFeature);
  }
  return newState;
}

const setFeatureNameReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.SetFeatureName,
): Model.Types.State => {
  const { featureId, name } = payload;
  let newState = state;
  newState = DotProp.set(newState, `features.byId.${featureId}.name`, name);
  return newState;
}

const setFeatureStyleReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.SetFeatureStyle,
): Model.Types.State => {
  const { featureIds, styleId } = payload;
  let newState = state;
  for (const featureId of featureIds) {
    newState = DotProp.set(newState, `features.byId.${featureId}.styleId`, styleId);
  }
  return newState;
}

const snapsToGridReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.SnapsToGrid,
): Model.Types.State => {
  let newState = state;
  const { featureIds, snapsToGrid } = payload;
  for (const featureId of featureIds) {
    newState = DotProp.set(newState, `features.byId.${featureId}.geometry.snapToGrid`, snapsToGrid);
  }
  return newState;
}

const setPathsClosedReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.SetPathsClosed,
): Model.Types.State => {
  let newState = state;
  const { pathIds, closed } = payload;
  for (const pathId of pathIds) {
    if (state.features.byId[pathId].geometry.type !== 'path') {
      continue;
    }
    newState = DotProp.set(newState, `features.byId.${pathId}.geometry.closed`, closed);
  }
  return newState;
}

const setStyleReducer = (
  state: Model.Types.State,
  style: Model.Types.Style,
): Model.Types.State => {
  let newState = state;
  newState = DotProp.set(newState, `styles.byId.${style.id}`, style);
  if (newState.styles.all.indexOf(style.id) < 0) {
    newState = DotProp.merge(newState, `styles.all`, [style.id]);
  }
  return newState;
}

export const modelReducer: Reducer<Model.Types.State> = newTypedReducer<Model.Types.State>()
  .handlePayload(Model.Actions.createLayer.type, createLayerReducer)
  .handlePayload(Model.Actions.createFeature.type, createFeatureReducer)
  .handlePayload(Model.Actions.translateFeatures.type, translateFeaturesReducer)
  .handlePayload(Model.Actions.setFeatureName.type, setFeatureNameReducer)
  .handlePayload(Model.Actions.setFeatureStyle.type, setFeatureStyleReducer)
  .handlePayload(Model.Actions.setSnapsToGrid.type, snapsToGridReducer)
  .handlePayload(Model.Actions.setPathsClosed.type, setPathsClosedReducer)
  .handlePayload(Model.Actions.setStyle.type, setStyleReducer)
  .handleDefault((state = INITIAL_STATE2) => state)
  .build();
