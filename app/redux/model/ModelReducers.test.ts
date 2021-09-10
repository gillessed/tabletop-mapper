import { createEmptyModel, createFeatureReducer, createLayerReducer, reparentNodesReducers } from "./ModelReducers";
import { Model } from "./ModelTypes";

const Feature1 = 'feature-1';
const Feature2 = 'feature-2';
const Feature3 = 'feature-3';
const Layer1 = 'layer-1';
const Layer2 = 'layer-2';
const Layer3 = 'layer-3';

const createBasicFeature = (id: string, parent: string): Model.Types.BasicAssetFeature => ({
  id,
  name: id,
  type: 'basic-asset',
  layerId: parent,
  geometry: anyRect(),
  assetId: 'some-asset',
})

const createBasicModel = (): Model.Types.State => {
  let model = createEmptyModel();
  model = createLayerReducer(model, { layerId: Layer1, parentId: Model.RootLayerId });
  model = createLayerReducer(model, { layerId: Layer2, parentId: Model.RootLayerId });
  model = createLayerReducer(model, { layerId: Layer3, parentId: Model.RootLayerId });
  model = createFeatureReducer(model, createBasicFeature(Feature1, Model.RootLayerId));
  model = createFeatureReducer(model, createBasicFeature(Feature2, Model.RootLayerId));
  model = createFeatureReducer(model, createBasicFeature(Feature3, Model.RootLayerId));
  return model;
}

const anyRect = (): Model.Types.Rectangle => ({ type: 'rectangle', p1: { x: 0, y: 0, }, p2: { x: 1, y: 1 } });

describe('Model Reducer Tests', () => {
  describe('Create Layer Tests', () => {
    test('Can create layer with empty state', () => {
      const emptyModel = createEmptyModel();
      const newLayerId = 'new-layer';
      const newModel = createLayerReducer(emptyModel, {
        layerId: newLayerId,
        parentId: Model.RootLayerId,
      });
      expect(newModel.layers.all.indexOf(newLayerId)).toBeGreaterThanOrEqual(0);
      expect(newModel.layers.byId[newLayerId].id).toBe(newLayerId);
    });
  });
  describe('Create Feature Tests', () => {
    test('Can create feature with empty state', () => {
      const emptyModel = createEmptyModel();
      const newFeatureId = 'new-feature';
      const newModel = createFeatureReducer(emptyModel, createBasicFeature(newFeatureId, Model.RootLayerId));
      expect(newModel.features.all.indexOf(newFeatureId)).toBeGreaterThanOrEqual(0);
      expect(newModel.features.byId[newFeatureId].id).toBe(newFeatureId);
    });
  });
  describe('Reparent Nodes Tests', () => {
    test('Reparent single feature within root layer', () => {
      const model = createBasicModel();
      expect(model.layers.byId[Model.RootLayerId].features.indexOf(Feature3)).toBe(2);
      const newModel = reparentNodesReducers(model, {
        nodeIds: [Feature3],
        target: {
          nodeId: Feature1,
          section: 'top',
        },
      });
      expect(newModel.layers.byId[Model.RootLayerId].features).toStrictEqual([Feature3, Feature1, Feature2]);
    });
    test('Reparent single layer within root layer', () => {
      const model = createBasicModel();
      expect(model.layers.byId[Model.RootLayerId].children.indexOf(Layer3)).toBe(2);
      const newModel = reparentNodesReducers(model, {
        nodeIds: [Layer3],
        target: {
          nodeId: Layer1,
          section: 'top',
        },
      });
      expect(newModel.layers.byId[Model.RootLayerId].children).toStrictEqual([Layer3, Layer1, Layer2]);
    });
    test('Reparent layer into folder', () => {
      const model = createBasicModel();
      expect(model.layers.byId[Model.RootLayerId].children.indexOf(Layer3)).toBe(2);
      const newModel = reparentNodesReducers(model, {
        nodeIds: [Feature1],
        target: {
          nodeId: Layer1,
          section: 'mid',
        },
      });
      expect(newModel.layers.byId[Model.RootLayerId].features).toStrictEqual([Feature2, Feature3]);
      expect(newModel.layers.byId[Layer1].features).toStrictEqual([Feature1]);
    });
    test('Reparent multiple features', () => {
      const model = createBasicModel();
      expect(model.layers.byId[Model.RootLayerId].features.indexOf(Feature3)).toBe(2);
      const newModel = reparentNodesReducers(model, {
        nodeIds: [Feature2, Feature3],
        target: {
          nodeId: Feature1,
          section: 'top',
        },
      });
      expect(newModel.layers.byId[Model.RootLayerId].features).toStrictEqual([Feature2, Feature3, Feature1]);
    });
    test('Reparent bottom section', () => {
      const model = createBasicModel();
      expect(model.layers.byId[Model.RootLayerId].features.indexOf(Feature3)).toBe(2);
      const newModel = reparentNodesReducers(model, {
        nodeIds: [Feature1, Feature2],
        target: {
          nodeId: Feature3,
          section: 'bottom',
        },
      });
      expect(newModel.layers.byId[Model.RootLayerId].features).toStrictEqual([Feature3, Feature1, Feature2]);
    });
  });
});