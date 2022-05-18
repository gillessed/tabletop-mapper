import { createEmptyModel, createFeatureReducer, createLayerReducer } from "./ModelReducers";
import { Model } from "./ModelTypes";

const anyRect = (): Model.Types.Rectangle => ({ type: 'rectangle', p1: { x: 0, y: 0, }, p2: { x: 1, y: 1 } });

const Feature1 = 'feature-1';
const Feature2 = 'feature-2';
const Feature3 = 'feature-3';
const Feature4 = 'feature-4';
const Feature5 = 'feature-5';
const Feature6 = 'feature-6';
const Layer1 = 'layer-1';
const Layer2 = 'layer-2';
const Layer3 = 'layer-3';

export const ModelTestIds = {
  Feature1,
  Feature2,
  Feature3,
  Feature4,
  Feature5,
  Feature6,
  Layer1,
  Layer2,
  Layer3,
}

export const createBasicFeature = (id: string, parent: string): Model.Types.BasicAssetFeature => ({
  id,
  name: id,
  type: 'basic-asset',
  layerId: parent,
  geometry: anyRect(),
  assetId: 'some-asset',
  rotation: 0,
  mirrored: false,
  opacity: 1,
  objectCover: 'contain',
})

export const createFlatModel = (): Model.Types.State => {
  let model = createEmptyModel();
  model = createLayerReducer(model, { layerId: Layer1, parentId: Model.RootLayerId });
  model = createLayerReducer(model, { layerId: Layer2, parentId: Model.RootLayerId });
  model = createLayerReducer(model, { layerId: Layer3, parentId: Model.RootLayerId });
  model = createFeatureReducer(model, createBasicFeature(Feature1, Model.RootLayerId));
  model = createFeatureReducer(model, createBasicFeature(Feature2, Model.RootLayerId));
  model = createFeatureReducer(model, createBasicFeature(Feature3, Model.RootLayerId));
  return model;
}

export const createNestedModel = (): Model.Types.State => {
  let model = createEmptyModel();
  model = createLayerReducer(model, { layerId: Layer1, parentId: Model.RootLayerId });
  model = createLayerReducer(model, { layerId: Layer2, parentId: Layer1 });
  model = createLayerReducer(model, { layerId: Layer3, parentId: Layer1 });
  model = createFeatureReducer(model, createBasicFeature(Feature1, Model.RootLayerId));
  model = createFeatureReducer(model, createBasicFeature(Feature2, Layer1));
  model = createFeatureReducer(model, createBasicFeature(Feature3, Layer1));
  model = createFeatureReducer(model, createBasicFeature(Feature4, Layer2));
  model = createFeatureReducer(model, createBasicFeature(Feature5, Layer2));
  model = createFeatureReducer(model, createBasicFeature(Feature6, Layer3));
  return model;
}
