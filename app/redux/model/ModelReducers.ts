import * as DotProp from 'dot-prop-immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { Model } from './ModelTypes';
import { translateGeometry } from './FeatureTranslation';
import { removeItem } from '../../utils/array';

export function createEmptyModel(): Model.Types.State {
  return {
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

export const createLayerReducer = (state: Model.Types.State, payload: Model.Payloads.CreateLayer): Model.Types.State => {
  const newLayer: Model.Types.Layer = {
    id: payload.layerId,
    visible: true,
    parent: payload.parentId,
    name: `New Layer`,
    children: [],
    features: [],
  };

  let newState = state;
  newState = DotProp.merge(newState, `layers.byId.${payload.parentId}.children`, [newLayer.id]);
  newState = DotProp.set(newState, `layers.byId.${newLayer.id}`, newLayer);
  newState = DotProp.merge(newState, `layers.all`, [newLayer.id]);
  return newState;
}

export const createFeatureReducer = (state: Model.Types.State, feature: Model.Types.Feature): Model.Types.State => {
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

export const reparentNodesReducers = (
  state: Model.Types.State,
  payload: Model.Payloads.ReparentNodes,
): Model.Types.State => {
  let newState = state;
  const { nodeIds, target } = payload;
  const { nodeId: targetId, section } = target;
  let parentLayerId;
  if (section === 'mid') {
    parentLayerId = targetId;
  } else if (state.layers.byId[targetId] != null) {
    parentLayerId = state.layers.byId[targetId].parent;
  } else {
    parentLayerId = state.features.byId[targetId].layerId;
  }
  const parentLayer = state.layers.byId[parentLayerId];
  let layerIndex = parentLayer.children.length - 1;
  let featureIndex = parentLayer.features.length - 1;
  if (section != 'mid' && state.layers.byId[targetId] != null) {
    layerIndex = parentLayer.children.indexOf(targetId);
    layerIndex -= section === 'top' ? 1 : 0;
  } else if (section != 'mid' && state.features.byId[targetId] != null) {
    featureIndex = parentLayer.features.indexOf(targetId);
    featureIndex -= section === 'top' ? 1 : 0;
  }
  const featuresLeft = parentLayer.features.slice(0, featureIndex + 1);
  const featuresRight = parentLayer.features.slice(featureIndex + 1);
  const layersLeft = parentLayer.children.slice(0, layerIndex + 1);
  const layersRight = parentLayer.children.slice(layerIndex + 1);
  for (const nodeId of nodeIds) {
    const maybeFeature = state.features.byId[nodeId];
    if (maybeFeature != null) {
      const sourceParent = state.layers.byId[maybeFeature.layerId];
      const sourceFeatureIndex = sourceParent.features.indexOf(nodeId);
      newState = DotProp.delete(newState, `layers.byId.${sourceParent.id}.features.${sourceFeatureIndex}`) as Model.Types.State;
      removeItem(featuresLeft, nodeId);
      removeItem(featuresRight, nodeId);
      featuresLeft.push(nodeId);
      newState = DotProp.set(newState, `features.byId.${nodeId}.layerId`, parentLayer.id) as Model.Types.State;
    } else {
      const maybeLayer = state.layers.byId[nodeId];
      const sourceParent = state.layers.byId[maybeLayer.parent];
      const sourceFeatureIndex = sourceParent.children.indexOf(nodeId);
      newState = DotProp.delete(newState, `layers.byId.${sourceParent.id}.children.${sourceFeatureIndex}`) as Model.Types.State;
      removeItem(layersLeft, nodeId);
      removeItem(layersRight, nodeId);
      layersLeft.push(nodeId);
      newState = DotProp.set(newState, `layers.byId.${nodeId}.parent`, parentLayer.id) as Model.Types.State;
    }
  }
  const newFeaturesList = [...featuresLeft, ...featuresRight];
  const newLayersList = [...layersLeft, ...layersRight];
  newState = DotProp.set(newState, `layers.byId.${parentLayer.id}.features`, newFeaturesList);
  newState = DotProp.set(newState, `layers.byId.${parentLayer.id}.children`, newLayersList);

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
  .handlePayload(Model.Actions.reparentNodes.type, reparentNodesReducers)
  .handleDefault((state = TestState) => state)
  .build();
