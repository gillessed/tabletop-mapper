import * as DotProp from 'dot-prop-immutable';
import { newTypedReducer, Reducer } from '../utils/typedReducer';
import { Model } from './ModelTypes';
import { translateGeometry } from './FeatureTranslation';
import { removeItem } from '../../utils/array';
import { undoable } from '../undo/UndoState';
import { getCoverSet, treeWalk } from './ModelTree';
import { generateRandomString } from '../../utils/randomId';
import { Colors } from '@blueprintjs/core';

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
      all: [Model.RootLayerId],
    },
    features: {
      byId: {},
      all: [],
    },
    settings: {
      backgroundColor: Colors.LIGHT_GRAY5,
      gridColor: '#394B59',
      showGrid: true,
      majorAxisStep: 50,
    }
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

const createFeaturePropertyReducer = <T extends Model.Payloads.SetValue<any>>(
  key: keyof Model.Types.BasicAssetFeature | keyof Model.Types.PatternFeature,
) => {
  return (
    state: Model.Types.State,
    payload: T,
  ) => {
    const { featureIds, value } = payload;
    let newState = state;
    for (const featureId of featureIds) {
      newState = DotProp.set(newState, `features.byId.${featureId}.${key}`, value);
    }
    return newState;
  }
}

export const createLayerReducer = (state: Model.Types.State, payload: Model.Payloads.CreateLayer): Model.Types.State => {
  const { layerId, parentId, name } = payload;
  const newLayer: Model.Types.Layer = {
    id: layerId,
    visible: true,
    parent: parentId,
    name: name ?? 'New Layer',
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

const setLayerNameReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.SetLayerName,
): Model.Types.State => {
  const { layerId, name } = payload;
  let newState = state;
  newState = DotProp.set(newState, `layers.byId.${layerId}.name`, name);
  return newState;
}

const setSnapToGridReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.SetBoolean,
): Model.Types.State => {
  let newState = state;
  const { featureIds, value } = payload;
  for (const featureId of featureIds) {
    const feature = newState.features.byId[featureId];
    newState = DotProp.set(newState, `features.byId.${featureId}.geometry.snapToGrid`, value);
    if (feature.type === 'basic-asset' && feature.clipRegion != null) {
      newState = DotProp.set(newState, `features.byId.${featureId}.clipRegion.snapToGrid`, value);
    }
  }
  return newState;
}

const setMirroredReducer = createFeaturePropertyReducer("mirrored");

const setPathsClosedReducer = (
  state: Model.Types.State,
  payload: Model.Payloads.SetBoolean,
): Model.Types.State => {
  let newState = state;
  const { featureIds, value } = payload;
  for (const featureId of featureIds) {
    if (state.features.byId[featureId].geometry.type !== 'path') {
      continue;
    }
    newState = DotProp.set(newState, `features.byId.${featureId}.geometry.closed`, value);
  }
  return newState;
}

const setOpacityReducer = createFeaturePropertyReducer("opacity");
const setRotationReducer = createFeaturePropertyReducer("rotation");
const setObjectCoverReducer = createFeaturePropertyReducer("objectCover");
const setClipRegionReducer = createFeaturePropertyReducer("clipRegion");

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
    const maybeFeature = newState.features.byId[nodeId];
    if (maybeFeature != null) {
      const sourceParent = newState.layers.byId[maybeFeature.layerId];
      const sourceFeatureIndex = sourceParent.features.indexOf(nodeId);
      newState = DotProp.delete(newState, `layers.byId.${sourceParent.id}.features.${sourceFeatureIndex}`) as Model.Types.State;
      removeItem(featuresLeft, nodeId);
      removeItem(featuresRight, nodeId);
      featuresLeft.push(nodeId);
      newState = DotProp.set(newState, `features.byId.${nodeId}.layerId`, parentLayer.id) as Model.Types.State;
    } else {
      const maybeLayer = newState.layers.byId[nodeId];
      const sourceParent = newState.layers.byId[maybeLayer.parent];
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

export const copyNodesReducers = (
  state: Model.Types.State,
  payload: Model.Payloads.CopyNodes,
): Model.Types.State => {

  const { nodeIds, translation } = payload;
  const { features: featureIndex, layers: layerIndex } = state;
  const coverSet = getCoverSet(nodeIds, featureIndex, layerIndex);

  let newState = state;

  const newFeatureIds: string[] = [];

  for (const sourceId of coverSet) {
    const rootParentLayerId = layerIndex.byId[sourceId]?.parent ?? featureIndex.byId[sourceId]?.layerId;
    const copiedIds = new Map<string, string>();
    treeWalk(
      featureIndex,
      layerIndex,
      {
        visitLayer: (layer) => {
          const newId = generateRandomString();
          copiedIds.set(layer.id, newId);
          const parentId = layer.id === sourceId ?
            rootParentLayerId :
            copiedIds.get(layer.parent);
          newState = createLayerReducer(newState, {
            layerId: newId,
            name: `Copy of ${layer.name}`,
            parentId,
          });
        },
        visitFeature: (feature) => {
          const parentId = feature.id === sourceId ?
            rootParentLayerId :
            copiedIds.get(feature.layerId);
          const newId = generateRandomString();
          const newFeature: Model.Types.Feature = {
            ...feature,
            id: newId,
            name: `Copy of ${feature.name}`,
            layerId: parentId,
          }
          newState = createFeatureReducer(newState, newFeature);
          newFeatureIds.push(newId);
        },
        startingNode: sourceId,
      },
    );
  }

  newState = translateFeaturesReducer(newState, {
    featureIds: newFeatureIds,
    translation,
  });

  return newState;
}

const setBackgroundColorReducer = (
  state: Model.Types.State,
  backgroundColor: string,
): Model.Types.State => DotProp.set(state, 'settings.backgroundColor', backgroundColor);

const setGridColorReducer = (
  state: Model.Types.State,
  gridColor: string,
): Model.Types.State => DotProp.set(state, 'settings.gridColor', gridColor);

const setShowGridReducer = (
  state: Model.Types.State,
  showGrid: boolean,
): Model.Types.State => DotProp.set(state, 'settings.showGrid', showGrid);

const setMajorAxisStepReducer = (
  state: Model.Types.State,
  majorAxisStep: number,
): Model.Types.State => DotProp.set(state, 'settings.majorAxisStep', majorAxisStep);

export const modelReducer: Reducer<Model.Types.State> = newTypedReducer<Model.Types.State>()
  .handlePayload(Model.Actions.createLayer.type, createLayerReducer)
  .handlePayload(Model.Actions.createFeature.type, createFeatureReducer)
  .handlePayload(Model.Actions.translateFeatures.type, translateFeaturesReducer)
  .handlePayload(Model.Actions.setFeatureGeometry.type, setFeatureGeometryReducer)
  .handlePayload(Model.Actions.setFeatureName.type, setFeatureNameReducer)
  .handlePayload(Model.Actions.setLayerName.type, setLayerNameReducer)
  .handlePayload(Model.Actions.setSnapToGrid.type, setSnapToGridReducer)
  .handlePayload(Model.Actions.setMirrored.type, setMirroredReducer)
  .handlePayload(Model.Actions.setOpacity.type, setOpacityReducer)
  .handlePayload(Model.Actions.setRotation.type, setRotationReducer)
  .handlePayload(Model.Actions.setPathsClosed.type, setPathsClosedReducer)
  .handlePayload(Model.Actions.setObjectCover.type, setObjectCoverReducer)
  .handlePayload(Model.Actions.setClipRegion.type, setClipRegionReducer)
  .handlePayload(Model.Actions.reparentNodes.type, reparentNodesReducers)
  .handlePayload(Model.Actions.copyNodes.type, copyNodesReducers)
  .handlePayload(Model.Actions.setBackgroundColor.type, setBackgroundColorReducer)
  .handlePayload(Model.Actions.setGridColor.type, setGridColorReducer)
  .handlePayload(Model.Actions.setShowGrid.type, setShowGridReducer)
  .handlePayload(Model.Actions.setMajorAxisStep.type, setMajorAxisStepReducer)
  .handleDefault((state = InitialState) => state)
  .build();

const modelUndoable = undoable(
  modelReducer,
  {
    denominator: "model",
    comparator: (oldState, newState) => oldState !== newState,
    initialState: InitialState,
  },
);

export const ModelUndo = modelUndoable.actions.undo;
export const ModelRedo = modelUndoable.actions.redo;
export const ModelSet = modelUndoable.actions.set;

export const undoableModelReducer = modelUndoable.reducer;
