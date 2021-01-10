import * as DotProp from 'dot-prop-immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { Asset } from './AssetTypes';
import { createIndexableReducers, Indexable } from '../utils/indexable';

const InitialState: Asset.Types.State = {
  assetIndex: { byId: {}, all: [] },
  assetPackIndex: { byId: {}, all: [] },
  tagIndex: { byId: {}, all: [] },
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
    newState = simpleAassetPackReducers.upsert(newState, newAssetPack);
  }
  return newState;
}

const simpleAassetPackReducers = createIndexableReducers<Asset.Types.State, Asset.Types.AssetPack>(
  (state: Asset.Types.State) => state.assetPackIndex,
  (state: Asset.Types.State, indexable: Indexable<Asset.Types.AssetPack>) => ({
    ...state,
    assetPackIndex: indexable,
  }),
);

const simpleTagReducers = createIndexableReducers<Asset.Types.State, Asset.Types.Tag>(
  (state: Asset.Types.State) => state.tagIndex,
  (state: Asset.Types.State, indexable: Indexable<Asset.Types.Tag>) => ({
    ...state,
    tagIndex: indexable,
  }),
);

export const assetReducer: Reducer<Asset.Types.State> = newTypedReducer<Asset.Types.State>()
  .handlePayload(Asset.Actions.setAssetState.type, setAssetStateReducer)
  .handlePayload(Asset.Actions.upsertAsset.type, upsertAssetReducer)
  .handlePayload(Asset.Actions.setAssetName.type, simpleAssetReducers.setName)
  .handlePayload(Asset.Actions.removeAsset.type, simpleAssetReducers.remove)
  .handlePayload(Asset.Actions.upsertAssetPack.type, simpleAassetPackReducers.upsert)
  .handlePayload(Asset.Actions.setAssetPackName.type, simpleAassetPackReducers.setName)
  .handlePayload(Asset.Actions.removeAssetPack.type, simpleAassetPackReducers.remove)
  .handlePayload(Asset.Actions.upsertTag.type, simpleTagReducers.upsert)
  .handlePayload(Asset.Actions.setTagName.type, simpleTagReducers.setName)
  .handlePayload(Asset.Actions.removeTag.type, simpleTagReducers.remove)
  .handleDefault((state = InitialState) => state)
  .build();

