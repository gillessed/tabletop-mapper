import * as DotProp from 'dot-prop-immutable';
import { newTypedReducer, Reducer } from '../utils/typedReducer';
import { Asset } from './AssetTypes';
import { createIndexableReducers, DeleteIndexablePayload, Indexable } from '../utils/indexable';

const InitialState: Asset.Types.State = {
  assetIndex: { byId: {}, all: [] },
  assetPackIndex: { byId: {}, all: [] },
  tagIndex: { byId: {}, all: [] },
  tagToAssetPackMap: new Map(),
  viewState: { type: 'search' },
};

const setAssetStateReducer = (
  _: Asset.Types.State,
  newState: Asset.Types.State,
): Asset.Types.State => {
  return newState;
}

const simpleAssetReducers = createIndexableReducers<Asset.Types.State, Asset.Types.Asset>(
  (state: Asset.Types.State) => state.assetIndex,
  (state: Asset.Types.State, indexable: Indexable<Asset.Types.Asset>) => ({
    ...state,
    assetIndex: indexable,
  }),
);

const upsertAssetReducer = (
  state: Asset.Types.State,
  payload: Asset.Types.Asset
): Asset.Types.State => {
  let newState = state;
  newState = simpleAssetReducers.upsert(newState, payload);
  const assetPack = state.assetPackIndex.byId[payload.assetPackId];
  if (assetPack != null && assetPack.assetIds.indexOf(payload.id) < 0) {
    const newAssetPack: Asset.Types.AssetPack = {
      ...assetPack,
      assetIds: [...assetPack.assetIds, payload.id],
    };
    newState = simpleAssetPackReducers.upsert(newState, newAssetPack);
  }
  return newState;
}

const simpleAssetPackReducers = createIndexableReducers<Asset.Types.State, Asset.Types.AssetPack>(
  (state: Asset.Types.State) => state.assetPackIndex,
  (state: Asset.Types.State, indexable: Indexable<Asset.Types.AssetPack>) => ({
    ...state,
    assetPackIndex: indexable,
  }),
);

const removeAssetPackReducer = (
  state: Asset.Types.State,
  payload: DeleteIndexablePayload,
): Asset.Types.State => {
  const assetPackId = payload.id;
  const assetPack = state.assetPackIndex.byId[assetPackId];
  if (assetPack == null) {
    return state;
  }
  let newState = simpleAssetPackReducers.remove(state, payload);
  const newTagMap = new Map(state.tagToAssetPackMap);
  for (const tagId of assetPack.tagIds) {
    const assetPackSet = newTagMap.get(tagId);
    const newAssetPackSet = new Set(assetPackSet);
    newAssetPackSet.delete(tagId);
    newTagMap.set(tagId, newAssetPackSet);
  }
  for (const assetId of assetPack.assetIds) {
    newState = simpleAssetReducers.remove(state, { id: assetId });
  }
  return { ...newState, tagToAssetPackMap: newTagMap };
};

const simpleTagReducers = createIndexableReducers<Asset.Types.State, Asset.Types.Tag>(
  (state: Asset.Types.State) => state.tagIndex,
  (state: Asset.Types.State, indexable: Indexable<Asset.Types.Tag>) => ({
    ...state,
    tagIndex: indexable,
  }),
);

function removeTagFromAssetPack(assetPack: Asset.Types.AssetPack, tagId: string): Asset.Types.AssetPack | null {
  if (assetPack.tagIds.indexOf(tagId) <= 0) {
    return null;
  }
  const newTagIds = [...assetPack.tagIds];
  newTagIds.splice(newTagIds.indexOf(tagId), 1);
  return { ...assetPack, tagIds: newTagIds };
}

const removeTagReducer = (
  state: Asset.Types.State,
  payload: DeleteIndexablePayload,
): Asset.Types.State => {
  const tagId = payload.id;
  const assetPackIds = state.tagToAssetPackMap.get(tagId);
  let newState = simpleTagReducers.remove(state, payload);
  for (const assetPackId of assetPackIds) {
    const assetPack = state.assetPackIndex.byId[assetPackId];
    const newAssetPack = removeTagFromAssetPack(assetPack, tagId);
    if (newAssetPack == null) {
      continue;
    }
    newState = simpleAssetPackReducers.upsert(newState, newAssetPack);
  }
  const newTagMap = new Map(state.tagToAssetPackMap);
  newTagMap.delete(tagId);
  return { ...newState, tagToAssetPackMap: newTagMap };
};

const addTagToAssetPackReducer = (
  state: Asset.Types.State,
  payload: Asset.Payloads.TagToAssetPackPayload,
): Asset.Types.State => {
  const { assetPackId, tagId } = payload;
  const assetPack = state.assetPackIndex.byId[assetPackId];
  if (assetPack == null || assetPack.tagIds.indexOf(tagId) >= 0) {
    return;
  }
  const newAssetPack = { ...assetPack, tagIds: [...assetPack.tagIds, tagId] };
  return simpleAssetPackReducers.upsert(state, newAssetPack);
};

const removeTagFromAssetPackReducer = (
  state: Asset.Types.State,
  payload: Asset.Payloads.TagToAssetPackPayload,
): Asset.Types.State => {
  const { assetPackId, tagId } = payload;
  const assetPack = state.assetPackIndex.byId[assetPackId];
  const newAssetPack = removeTagFromAssetPack(assetPack, tagId);
  if (newAssetPack == null) {
    return state;
  }
  return simpleAssetPackReducers.upsert(state, newAssetPack);
};

const createAndAddTagReducer = (
  state: Asset.Types.State,
  payload: Asset.Payloads.CreateAndAddTagPayload,
): Asset.Types.State => {
  const { tag, assetPackId } = payload;
  let newState = simpleTagReducers.upsert(state, tag);
  newState = addTagToAssetPackReducer(newState, { tagId: tag.id, assetPackId });
  return newState;
};

const setAssetViewStateReducer = (
  state: Asset.Types.State,
  viewState: Asset.Types.AssetViewState,
): Asset.Types.State => ({ ...state, viewState });

export const assetReducer: Reducer<Asset.Types.State> = newTypedReducer<Asset.Types.State>()
  .handlePayload(Asset.Actions.setAssetState.type, setAssetStateReducer)
  .handlePayload(Asset.Actions.upsertAsset.type, upsertAssetReducer)
  .handlePayload(Asset.Actions.setAssetName.type, simpleAssetReducers.setName)
  .handlePayload(Asset.Actions.removeAsset.type, simpleAssetReducers.remove)
  .handlePayload(Asset.Actions.upsertAssetPack.type, simpleAssetPackReducers.upsert)
  .handlePayload(Asset.Actions.setAssetPackName.type, simpleAssetPackReducers.setName)
  .handlePayload(Asset.Actions.removeAssetPack.type, removeAssetPackReducer)
  .handlePayload(Asset.Actions.upsertTag.type, simpleTagReducers.upsert)
  .handlePayload(Asset.Actions.setTagName.type, simpleTagReducers.setName)
  .handlePayload(Asset.Actions.removeTag.type, removeTagReducer)
  .handlePayload(Asset.Actions.addTagToAssetPack.type, addTagToAssetPackReducer)
  .handlePayload(Asset.Actions.removeTagFromAssetPack.type, removeTagFromAssetPackReducer)
  .handlePayload(Asset.Actions.createAndAddTag.type, createAndAddTagReducer)
  .handlePayload(Asset.Actions.setViewState.type, setAssetViewStateReducer)
  .handleDefault((state = InitialState) => state)
  .build();

