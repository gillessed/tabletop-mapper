import { Model } from './ModelTypes';
import { setIntersection } from '../../utils/sets';

export function reverseArray<T>(array: T[]): T[] {
  const reversed = [];
  for (let i = 1; i <= array.length; i++) {
    reversed.push(array[array.length - i]);
  }
  return reversed;
}

export function treeWalk(
  model: Model.Types.State,
  visitFeature: (feature: Model.Types.Feature<any>) => void,
) {
  const stack: Array<Model.Types.Feature | Model.Types.Layer> = [model.layers.byId[Model.RootLayerId]];
  while (stack.length !== 0) {
    const object = stack.pop();
    if (Model.Types.isFeature(object)) {
      visitFeature(object);
    } else if (Model.Types.isLayer(object)) {
      const children = object.children.map((layerId) => {
        return model.layers.byId[layerId];
      });
      stack.push(...reverseArray(children));
      
      const features = object.features.map((featureId) => {
        return model.features.byId[featureId];
      });
      stack.push(...reverseArray(features));
    }
  }
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
