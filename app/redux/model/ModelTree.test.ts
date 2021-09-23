import { createEmptyModel, createFeatureReducer, createLayerReducer, reparentNodesReducers } from "./ModelReducers";
import { createNestedModel, ModelTestIds } from "./ModelTestUtils";
import { getCoverSet, getDecscendants } from "./ModelTree";

const { Layer1, Layer2, Layer3, Feature1, Feature2, Feature3, Feature4, Feature5, Feature6 } = ModelTestIds;

describe('Model Tree Tests', () => {
  describe('Descendants Tests', () => {
    test('Gets descendants of a layer', () => {
      const emptyModel = createNestedModel();
      const descendants = getDecscendants(
        Layer2,
        emptyModel.features,
        emptyModel.layers,
      );
      expect(descendants.size).toBe(2);
      expect(descendants.has(Feature4)).toBe(true);
      expect(descendants.has(Feature5)).toBe(true);
    });
  });
  describe('Cover Set Tests', () => {
    test('Gets cover set of a single layer and its feature children', () => {
      const emptyModel = createNestedModel();
      const coverSet = getCoverSet(
        [Layer1, Feature2, Feature3],
        emptyModel.features,
        emptyModel.layers,
      );
      expect(coverSet.size).toBe(1);
      expect(coverSet.has(Layer1)).toBe(true);
      expect(coverSet.has(Feature2)).toBe(false);
      expect(coverSet.has(Feature3)).toBe(false);
    });
  });
});