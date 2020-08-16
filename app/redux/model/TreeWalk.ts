import { Model } from './ModelTypes';

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