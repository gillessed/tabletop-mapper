import { Model } from './ModelTypes';
import { setIntersection, setMax } from '../../utils/sets';
import { Indexable } from '../utils/indexable';

export function reverseArray<T>(array: T[]): T[] {
  const reversed = [];
  for (let i = 1; i <= array.length; i++) {
    reversed.push(array[array.length - i]);
  }
  return reversed;
}

export function treeWalk(
  features: Indexable<Model.Types.Feature>,
  layers: Indexable<Model.Types.Layer>,
  visitFeature: (feature: Model.Types.Feature<any>) => void,
) {
  const stack: Array<Model.Types.Feature | Model.Types.Layer> = [layers.byId[Model.RootLayerId]];
  while (stack.length !== 0) {
    const object = stack.pop();
    if (Model.Types.isFeature(object)) {
      visitFeature(object);
    } else if (Model.Types.isLayer(object)) {
      const layerChildren = object.children.map((layerId) => {
        return layers.byId[layerId];
      });
      stack.push(...reverseArray(layerChildren));
      
      const featureChildren = object.features.map((featureId) => {
        return features.byId[featureId];
      });
      stack.push(...reverseArray(featureChildren));
    }
  }
}

export function getOrderedFeatures(
  features: Indexable<Model.Types.Feature>,
  layers: Indexable<Model.Types.Layer>,
): Model.Types.Feature[] {
  const orderedFeatures: Model.Types.Feature[] = [];
  treeWalk(features, layers, (feature) => orderedFeatures.push(feature));
  return orderedFeatures;
}

export function getHighestFeatureId(
  features: Indexable<Model.Types.Feature>,
  layers: Indexable<Model.Types.Layer>,
  featureIds: Iterable<string>,
): string {
  const orderedFeatures = getOrderedFeatures(features, layers);
  const indexedFeatures: { [featureId: string]: number } = {};
  orderedFeatures.forEach((feature, index) => {
    indexedFeatures[feature.id] = index;
  });
  const highestFeature = setMax(
    featureIds,
    (featureId) => indexedFeatures[featureId],
  );
  return highestFeature;
}

export function getAncestors(
  model: Model.Types.State,
  id: string,
): Set<string> {
  const ancestors = new Set<string>();
  let startingLayerId = id;
  if (model.features.byId[id] != null) {
    startingLayerId = model.features.byId[id].layerId;
    ancestors.add(startingLayerId);
  }
  let layer = model.layers.byId[startingLayerId];
  while(layer.parent != null) {
    ancestors.add(layer.parent);
    layer = model.layers.byId[layer.parent];
  }
  return ancestors;
}

export function findCommonAncestor(
  model: Model.Types.State,
  ids: Iterable<string>,
): string {
  const allAncestors: Set<string>[] = [];
  for (const id of ids) {
    allAncestors.push(getAncestors(model, id));
  }
  const commonAncestors = setIntersection(...allAncestors);
  let lowestCommonAncestor = '';
  for (const id of commonAncestors) {
    const children = new Set(model.layers.byId[id].children);
    if (setIntersection(children, commonAncestors).size === 0) {
      lowestCommonAncestor = id;
      break;
    }
  }
  return lowestCommonAncestor;
}
