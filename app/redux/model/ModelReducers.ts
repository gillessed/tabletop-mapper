import * as DotProp from 'dot-prop-immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { Model } from './ModelTypes';
import { findByName } from "./ModelUtils";
import { translateGeometry } from './FeatureTranslation';

export function createEmptyModel(): Model.Types.State {
  return{
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
    features: {
      byId: {},
      all: [],
    },
  };
}

const InitialState: Model.Types.State = createEmptyModel();

const TestState: Model.Types.State = {
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

const setModelReducer = (_: Model.Types.State, newState: Model.Types.State): Model.Types.State => newState;

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
    const translatedGeometry = translateGeometry(feature.geometry, translation);
    const translatedFeature = { ...feature, geometry: translatedGeometry } as Model.Types.Feature;
    newState = DotProp.set(newState, `features.byId.${feature.id}`, translatedFeature);
  }
  return newState;
}

const setFeatureGeometryReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.SetFeatureGeometryPayload,
): Model.Types.State => {
  const { featureId, geometry } = payload;
  return DotProp.set(state, `features.byId.${featureId}.geometry`, geometry);
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

export const modelReducer: Reducer<Model.Types.State> = newTypedReducer<Model.Types.State>()
  .handlePayload(Model.Actions.setModel.type, setModelReducer)
  .handlePayload(Model.Actions.createLayer.type, createLayerReducer)
  .handlePayload(Model.Actions.createFeature.type, createFeatureReducer)
  .handlePayload(Model.Actions.translateFeatures.type, translateFeaturesReducer)
  .handlePayload(Model.Actions.setFeatureGeometry.type, setFeatureGeometryReducer)
  .handlePayload(Model.Actions.setFeatureName.type, setFeatureNameReducer)
  .handlePayload(Model.Actions.setFeatureStyle.type, setFeatureStyleReducer)
  .handlePayload(Model.Actions.setSnapsToGrid.type, snapsToGridReducer)
  .handlePayload(Model.Actions.setPathsClosed.type, setPathsClosedReducer)
  .handleDefault((state = TestState) => state)
  .build();
