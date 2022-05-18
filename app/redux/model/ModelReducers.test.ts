import { Vector } from "../../math/Vector";
import { copyNodesReducers, createEmptyModel, createFeatureReducer, createLayerReducer, reparentNodesReducers } from "./ModelReducers";
import { createBasicFeature, createFlatModel, createNestedModel, ModelTestIds } from "./ModelTestUtils";
import { Model } from "./ModelTypes";

const { Layer1, Layer2, Layer3, Feature1, Feature2, Feature3 } = ModelTestIds;

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
      const model = createFlatModel();
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
      const model = createFlatModel();
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
      const model = createFlatModel();
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
      const model = createFlatModel();
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
      const model = createFlatModel();
      const newModel = reparentNodesReducers(model, {
        nodeIds: [Feature1, Feature2],
        target: {
          nodeId: Feature3,
          section: 'bottom',
        },
      });
      expect(newModel.layers.byId[Model.RootLayerId].features).toStrictEqual([Feature3, Feature1, Feature2]);
    });
    test('Reparent single feature into layer', () => {
      const model = createFlatModel();
      const newModel = reparentNodesReducers(model, {
        nodeIds: [Feature1],
        target: {
          nodeId: Layer1,
          section: 'mid',
        },
      });
      expect(newModel.layers.byId[Model.RootLayerId].features).toStrictEqual([Feature2, Feature3]);
      expect(newModel.layers.byId[Layer1].features).toStrictEqual([Feature1]);
      expect(newModel.features.byId[Feature1].layerId).toBe(Layer1);
    });
    test('Reparent multiple features into layer', () => {
      const model = createFlatModel();
      const newModel = reparentNodesReducers(model, {
        nodeIds: [Feature1, Feature2, Feature3],
        target: {
          nodeId: Layer1,
          section: 'mid',
        },
      });
      expect(newModel.layers.byId[Model.RootLayerId].features).toStrictEqual([]);
      expect(newModel.layers.byId[Layer1].features).toStrictEqual([Feature1, Feature2, Feature3]);
      expect(newModel.features.byId[Feature1].layerId).toBe(Layer1);
      expect(newModel.features.byId[Feature2].layerId).toBe(Layer1);
      expect(newModel.features.byId[Feature3].layerId).toBe(Layer1);
    });
  });
  describe('Copy Nodes Tests', () => {
    test('Copy single layer', () => {
      const model = createFlatModel();
      const newModel = copyNodesReducers(model, {
        nodeIds: [Layer1],
        translation: new Vector(0, 0),
      });
      const newRootLayer = newModel.layers.byId[Model.RootLayerId];
      expect(newRootLayer.children.length).toBe(4);
      const newId = newRootLayer.children[3];
      expect(newRootLayer.children[0]).not.toBe(newId);
      expect(newModel.layers.byId[newId].id).toBe(newId);
      expect(newModel.layers.byId[newId].name).toBe(`Copy of New Layer`);
      expect(newModel.features === model.features);
    });
    test('Copy single feature', () => { 
      const model = createFlatModel();
      const newModel = copyNodesReducers(model, {
        nodeIds: [Feature1],
        translation: new Vector(0, 0),
      });
      const newRootLayer = newModel.layers.byId[Model.RootLayerId];
      expect(newRootLayer.features.length).toBe(4);
      const newId = newRootLayer.features[3];
      expect(newRootLayer.features[0]).not.toBe(newId);
      expect(newModel.features.byId[newId].id).toBe(newId);
      expect(newModel.features.byId[newId].name).toBe(`Copy of ${Feature1}`);
      expect(newModel.layers === model.layers);
    });
    test('Layer with feature', () => {
      const model = createNestedModel();
      const newModel = copyNodesReducers(model, {
        nodeIds: [Layer3],
        translation: new Vector(0, 0),
      });
      const newLayer1 = newModel.layers.byId[Layer1];
      expect(newLayer1.features.length).toBe(2);
      const copiedLayerId = newLayer1.children[1];
      const copiedLayer = newModel.layers.byId[copiedLayerId];
      expect(copiedLayer.features.length).toBe(1);
      expect(copiedLayer.children.length).toBe(0);
      expect(copiedLayer.parent).toBe(Layer1);
      const copiedFeatureId = copiedLayer.features[0];
      const copiedFeature = newModel.features.byId[copiedFeatureId];
      expect(copiedFeature.layerId).toBe(copiedLayerId);
    });
    test('Complex case', () => {
      const model = createNestedModel();
      const newModel = copyNodesReducers(model, {
        nodeIds: [Layer1],
        translation: new Vector(0, 0),
      });
      const newRootLayer = newModel.layers.byId[Model.RootLayerId];
      expect(newRootLayer.children.length).toBe(2);
      const newLayer1Id = newRootLayer.children[1];
      const newLayer1 = newModel.layers.byId[newLayer1Id];
      expect(newLayer1.features.length).toBe(2);
      expect(newLayer1.children.length).toBe(2);
      const newLayer2Id = newLayer1.children[0];
      const newLayer2 = newModel.layers.byId[newLayer2Id];
      expect(newLayer2.children.length).toBe(0);
      expect(newLayer2.features.length).toBe(2);
      expect(newLayer2.parent).toBe(newLayer1Id);
    });
  });
});
