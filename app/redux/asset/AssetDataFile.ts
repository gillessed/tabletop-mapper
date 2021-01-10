import { Asset } from './AssetTypes';
import { AppConfig } from '../../config/AppConfig';
import { serializeIndexable, deserializeIndexable } from '../utils/indexable';
import { app } from 'electron';

export interface SerializedAssetState {
  assets: Asset.Types.Asset[];
  assetPacks: Asset.Types.AssetPack[];
  tags: Asset.Types.Tag[];
}

function createEmptySerializedState(): SerializedAssetState {
  return {
    assets: [],
    assetPacks: [],
    tags: [],
  }
}

export async function readAssetDataFile(appConfig: AppConfig): Promise<Asset.Types.State> {
  const serializedAssets = await readSerializedAssets(appConfig);
  const state: Asset.Types.State = {
    assetIndex: deserializeIndexable(serializedAssets.assets),
    assetPackIndex: deserializeIndexable(serializedAssets.assetPacks),
    tagIndex: deserializeIndexable(serializedAssets.tags),
  };
  return state;
}

export async function writeAssetDataFile(appConfig: AppConfig, assets: Asset.Types.State): Promise<void> {
  const serializedAssets: SerializedAssetState = {
    assets: serializeIndexable(assets.assetIndex),
    assetPacks: serializeIndexable(assets.assetPackIndex),
    tags: serializeIndexable(assets.tagIndex),
  }
  await writeSerializedAssets(appConfig, serializedAssets);
}

async function readSerializedAssets(appConfig: AppConfig): Promise<SerializedAssetState> {
  const { assetDataFile } = appConfig;
  const exists = await assetDataFile.exists();
  if (!exists) {
    assetDataFile.writeFile(JSON.stringify(createEmptySerializedState()));
  }

  const rawAssetData = await assetDataFile.readFile();
  const serializedAssets: SerializedAssetState = JSON.parse(rawAssetData);
  return serializedAssets;
}

async function writeSerializedAssets(appConfig: AppConfig, serialized: SerializedAssetState): Promise<void> {
  const rawAssetData = JSON.stringify(serialized);
  await appConfig.assetDataFile.writeFile(rawAssetData);
}
