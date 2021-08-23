import { all, takeEvery, call, put, select } from "redux-saga/effects";
import { SagaContext } from "../AppSaga";
import { TypedAction } from "../utils/typedAction";
import { Asset } from "./AssetTypes";
import { Filer } from "../../utils/filer";
import { renderProgressToast } from "../../containers/toast/ProgressToast";
import { generateRandomString } from "../../utils/randomId";
import { writeAssetDataFile } from "./AssetDataFile";
import { Indexable } from "../utils/indexable";

export function* assetSaga(context: SagaContext) {
  yield all([
    takeEvery(Asset.Actions.importAssets.type, importAssetsSaga, context),
    takeEvery(Asset.Actions.saveAssetFile.type, saveAssetDataFile, context),
  ]);
}

async function getFilesToImport(paths: string[]): Promise<Filer[]> {
  const filesToImport: Filer[] = [];
  for (const path of paths) {
    const fileToImport = Filer.open(path);
    await fileToImport.treeWalk({
      onFile: (file: Filer) => {
        if (file.isImage()) {
          filesToImport.push(file);
        }
      }
    });
  }
  return filesToImport;
}

const NewBackBaseName = 'New Asset Pack';
function getNewAssetPackName(assetPackIndex: Indexable<Asset.Types.AssetPack>) {
  const allPackNames = new Set<string>();
  for (const assetPackId of assetPackIndex.all) {
    allPackNames.add(assetPackIndex.byId[assetPackId].name);
  }
  let packIndex = 1;
  while (allPackNames.has(NewBackBaseName + ' ' + packIndex)) {
    packIndex++;
  }
  return NewBackBaseName + ' ' + packIndex;
}

function* importAssetsSaga(context: SagaContext, action: TypedAction<string[]>) {
  const { appConfig, appToaster } = context;
  const filesToImport: Filer[] = yield call(getFilesToImport, action.payload);
  const toastKey = renderProgressToast(appToaster, 0);
  const assetPackIndex: ReturnType<typeof Asset.Selectors.getAssetPackIndex> = yield select(Asset.Selectors.getAssetPackIndex);
  const packName = getNewAssetPackName(assetPackIndex);
  const newAssetPack: Asset.Types.AssetPack = {
    id: generateRandomString(),
    name: packName,
    assetIds: [],
    tagIds: [],
  }
  yield put(Asset.Actions.upsertAssetPack.create(newAssetPack));
  let progress = 0;
  for (const fileToImport of filesToImport) {
    try {
      const originalExtension = fileToImport.getExtension();
      const newAsset: Asset.Types.Asset = {
        id: generateRandomString(),
        name: fileToImport.getFilenameNoExtension(),
        extension: originalExtension,
        tagIds: [],
        assetPackId: newAssetPack.id,
      };
      const target = appConfig.getAssetFileById(newAsset.id, originalExtension);
      yield call(target.getParent().mkdirP);
      yield call(fileToImport.copyTo, target);
      yield put(Asset.Actions.upsertAsset.create(newAsset));
    } catch (error) {
      console.error(error);
    } finally {
      progress++;
      renderProgressToast(appToaster, progress / filesToImport.length, toastKey);
    }
  }
  yield put(Asset.Actions.saveAssetFile.create());
}

let writingAssetFile = false;
let queuedWrite = false;

function* saveAssetDataFile(context: SagaContext) {
  if (writingAssetFile === true) {
    queuedWrite = true;
    return;
  } else {
    writingAssetFile = true;
  }
  const { appConfig } = context;
  const assetState: ReturnType<typeof Asset.Selectors.get> = yield select(Asset.Selectors.get);
  writeAssetDataFile(appConfig, assetState);
  writingAssetFile = false;
  if (queuedWrite) {
    queuedWrite = false;
    yield put(Asset.Actions.saveAssetFile.create());
  }
}
