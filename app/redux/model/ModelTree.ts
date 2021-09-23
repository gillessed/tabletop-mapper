import { Model } from './ModelTypes';
import { setIntersection, setMax } from '../../utils/sets';
import { Indexable, Identifiable } from '../utils/indexable';

export function reverseArray<T>(array: T[]): T[] {
  const reversed = [];
  for (let i = 1; i <= array.length; i++) {
    reversed.push(array[array.length - i]);
  }
  return reversed;
}

export interface TreeWalkOptions {
  visitFeature?: (feature: Model.Types.Feature) => void;
  visitLayer?: (layer: Model.Types.Layer) => void;
  startingNode?: string;
}

export function treeWalk(
  features: Indexable<Model.Types.Feature>,
  layers: Indexable<Model.Types.Layer>,
  { visitFeature, visitLayer, startingNode }: TreeWalkOptions,
) {
  const startingItemId = startingNode ?? Model.RootLayerId;
  const startingItem = layers.byId[startingItemId] ?? features.byId[startingItemId];
  if (startingItemId == null) {
    return;
  }
  const stack: Array<Model.Types.Feature | Model.Types.Layer> = [startingItem];
  while (stack.length !== 0) {
    const object = stack.pop();
    if (Model.Types.isFeature(object)) {
      visitFeature(object);
    } else if (Model.Types.isLayer(object)) {
      visitLayer?.(object);
      
      const featureChildren = object.features.map((featureId) => {
        return features.byId[featureId];
      });
      featureChildren.reverse();
      stack.push(...featureChildren);
      const layerChildren = object.children.map((layerId) => {
        return layers.byId[layerId];
      });
      layerChildren.reverse();
      stack.push(...layerChildren);
    }
  }
}

export function getOrderedFeatures(
  features: Indexable<Model.Types.Feature>,
  layers: Indexable<Model.Types.Layer>,
): Model.Types.Feature[] {
  const orderedFeatures: Model.Types.Feature[] = [];
  treeWalk(features, layers, { visitFeature: (feature) => orderedFeatures.push(feature) });
  return orderedFeatures;
}

export function getOrderedObjectIds(
  features: Indexable<Model.Types.Feature>,
  layers: Indexable<Model.Types.Layer>,
): string[] {
  const objects: Identifiable[] = [];
  treeWalk(
    features,
    layers,
    {
      visitFeature: (feature) => objects.push(feature),
      visitLayer: (layer) => objects.push(layer),
    },
  );
  return objects.map((object) => object.id);
}

export function getHighestFeatureId(
  features: Indexable<Model.Types.Feature>,
  layers: Indexable<Model.Types.Layer>,
  featureIds: Iterable<string>,
): string {
  const orderedFeatures = getOrderedFeatures(features, layers);
  // highest feature is lowest in the tree
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

/**
 * Returns the nodes in the tree that lie between the two input nodes, given a depth first
 * ordering of the tree. Return value is inclusive.
 */
export function getNodesBetween(
  featureIndex: Indexable<Model.Types.Feature>,
  layerIndex: Indexable<Model.Types.Layer>,
  nodeId1: string,
  nodeId2: string,
): string[] {
  const orderedIds = getOrderedObjectIds(featureIndex, layerIndex);
  const index1 = orderedIds.indexOf(nodeId1);
  const index2 = orderedIds.indexOf(nodeId2);
  const start = Math.min(index1, index2);
  const end = Math.max(index1, index2);
  return orderedIds.slice(start, end + 1);
}

/**
 * Returns all layers that contain the input id as a descendant. It is exclusive,
 * and does not include the feature/layer itself.
 */
export function getAncestors(
  featureIndex: Indexable<Model.Types.Feature>,
  layerIndex: Indexable<Model.Types.Layer>,
  id: string,
): Set<string> {
  const ancestors = new Set<string>();
  let startingLayerId = id;
  if (featureIndex.byId[id] != null) {
    startingLayerId = featureIndex.byId[id].layerId;
    ancestors.add(startingLayerId);
  }
  let layer = layerIndex.byId[startingLayerId];
  while(layer?.parent != null) {
    ancestors.add(layer.parent);
    layer = layerIndex.byId[layer.parent];
  }
  return ancestors;
}

export function getAllAncestors(
  featureIndex: Indexable<Model.Types.Feature>,
  layerIndex: Indexable<Model.Types.Layer>,
  ids: Iterable<string>,
): Set<string> {
  const input = new Set<string>(ids);
  const allAncestors = new Set<string>();
  for (const id of ids) {
    const ancestors = getAncestors(featureIndex, layerIndex, id);
    for (const ancestorId of ancestors) {
      if (!input.has(ancestorId)) {
        allAncestors.add(ancestorId);
      }
    }
  }
  return allAncestors;
}

export function findCommonAncestor(
  featureIndex: Indexable<Model.Types.Feature>,
  layerIndex: Indexable<Model.Types.Layer>,
  ids: Iterable<string>,
): string {
  const allAncestors: Set<string>[] = [];
  for (const id of ids) {
    allAncestors.push(getAncestors(featureIndex, layerIndex, id));
  }
  const commonAncestors = setIntersection(...allAncestors);
  let lowestCommonAncestor = '';
  for (const id of commonAncestors) {
    const children = new Set(layerIndex.byId[id].children);
    if (setIntersection(children, commonAncestors).size === 0) {
      lowestCommonAncestor = id;
      break;
    }
  }
  return lowestCommonAncestor;
}

export type ReparentSection = 'top' | 'mid' | 'bottom';

export interface ReparentTarget {
  nodeId: string;
  section: ReparentSection;
}

/**
 * Returns true iff the reparent target is valid and useful. A reparent is considered invalid
 * if any of the selected nodes are ancestors of the target layer, or its parent if the target
 * is a feature. A reparent is useful if it will actually create a new and different state tree.
 * This lets up avoid a state update if the reparent does nothing. This also includes the case
 * where the selection list is empty.
 */
export function isValidReparent( 
  featureIndex: Indexable<Model.Types.Feature>,
  layerIndex: Indexable<Model.Types.Layer>,
  selection: string[],
  target: ReparentTarget,
): boolean {
  if (selection.length === 0) {
    return null;
  }
  const selectionContainsTarget = selection.indexOf(target.nodeId) >= 0;
  const targetAncestors = getAncestors(featureIndex, layerIndex, target.nodeId);
  const selectionContainsTargetAncestor = !!selection.find((nodeId) => targetAncestors.has(nodeId));
  const invalidReparent = selectionContainsTarget || selectionContainsTargetAncestor;
  return !invalidReparent;
}

/**
 * Returns the ids of all descendant nodes of the input id, non-inclusive.
 */
export function getDecscendants(
  id: string,
  featureIndex: Indexable<Model.Types.Feature>,
  layerIndex: Indexable<Model.Types.Layer>,
): Set<string> {
  const descendantIds = new Set<string>();
  treeWalk(featureIndex, layerIndex, {
    visitFeature: (feature) => descendantIds.add(feature.id),
    visitLayer: (layer) => descendantIds.add(layer.id),
    startingNode: id,
  });
  descendantIds.delete(id);
  return descendantIds;
}

export function getAllDescendants(
  ids: Iterable<string>,
  featureIndex: Indexable<Model.Types.Feature>,
  layerIndex: Indexable<Model.Types.Layer>,
): Set<string> {
  const coverSet = new Set(ids);
  for (const id of ids) {
    const descendants = getDecscendants(id, featureIndex, layerIndex);
    for (const descendant of descendants) {
      coverSet.add(descendant);
    }
  }
  return coverSet;
}

/**
 * Returns the set of all nodes of the input who contains no ancestors also within the input.
 */
export function getCoverSet(
  ids: Iterable<string>,
  featureIndex: Indexable<Model.Types.Feature>,
  layerIndex: Indexable<Model.Types.Layer>,
): Set<string> {
  const coverSet = new Set(ids);
  for (const id of ids) {
    const descendants = getDecscendants(id, featureIndex, layerIndex);
    for (const descendant of descendants) {
      coverSet.delete(descendant);
    }
  }
  return coverSet;
}
