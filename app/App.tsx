import { Classes, Colors, Spinner, Toaster } from "@blueprintjs/core";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { FileCopier } from "../filer/fileCopier";
import { Filer, setFilerSeparator } from "../filer/filer";
import { AppConfigContextProvider } from "./AppConfigContextProvider";
import { registerDebugCommands } from "./DebugCommands";
import { DispatcherContextProvider } from "./DispatcherContextProvider";
import { registerKeyboardShortcuts } from "./KeyboardShortcuts";
import {
  AppConfigFiles,
  createNewAppConfig,
  readAppConfig,
  writeAppConfig,
} from "./config/AppConfig";
import { Root } from "./containers/Root";
import { getIpc } from "./ipc/ipc";
import { AppReducer, ReduxState } from "./redux/AppReducer";
import { SagaContext, appSaga } from "./redux/AppSaga";
import { dispatcherCreators } from "./redux/Dispatchers";
import { loggerPredicate } from "./redux/Logger";
import { readAssetDataFile } from "./redux/asset/AssetDataFile";
import { Asset } from "./redux/asset/AssetTypes";
import "./scss/Scrollbar.scss";
import { createRoot } from "react-dom/client";

const AppVersion = "0.1.0";

function LoadingScreen() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: Colors.DARK_GRAY5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Helvetica Neue",
        color: Colors.LIGHT_GRAY1,
        fontSize: "18px",
      }}
    >
      <Spinner className={Classes.DARK} size={100} />
      <span style={{ marginTop: "10px" }}> Initializing...</span>
    </div>
  );
}

async function initialize() {
  const rootNode = document.getElementById("content");
  if (rootNode == null) {
    throw Error("Root node missing?");
  }
  const root = createRoot(rootNode);
  root.render(<LoadingScreen />);

  const platformInfo = await getIpc().platformInfo();
  console.log("platform info ", platformInfo);
  const { appDirPath, separatorChar } = platformInfo;
  setFilerSeparator(separatorChar);
  const appDir = Filer.open(appDirPath);

  await appDir.mkdirP();
  const appConfigFile = appDir.resolve(AppConfigFiles.appConfigFilename);
  console.log("Checking for app config file");
  const appConfigExists = await appConfigFile.exists();
  if (!appConfigExists) {
    const newAppConfig = createNewAppConfig(platformInfo, appDir, AppVersion);
    console.log("Writing blank app config file");
    await writeAppConfig(appConfigFile, newAppConfig);
  }

  console.log("Reading app config");
  const appConfig = await readAppConfig(platformInfo, appConfigFile);

  console.log("Creating project and asset directories");
  await appConfig.projectsDir.mkdirP();
  await appConfig.assetDir.mkdirP();

  console.log("Initialized app with config", appConfig);

  const sagaMiddleware = createSagaMiddleware();

  const logger = createLogger({
    predicate: loggerPredicate,
  });

  const store = createStore<ReduxState, any>(
    AppReducer as any,
    applyMiddleware(logger as any, sagaMiddleware)
  );
  registerKeyboardShortcuts(store, platformInfo);
  registerDebugCommands(store);

  const assets = await readAssetDataFile(appConfig);
  store.dispatch(Asset.Actions.setAssetState.create(assets));

  console.log("Initialized asset state", assets);

  const dispatchers = dispatcherCreators(store);
  const fileCopier = new FileCopier();
  const appToaster = Toaster.create();
  const sagaContext: SagaContext = {
    fileCopier,
    appConfig,
    appToaster,
  };
  sagaMiddleware.run(appSaga, sagaContext);

  const providers = (
    <Provider store={store}>
      <AppConfigContextProvider value={appConfig}>
        <DispatcherContextProvider value={dispatchers}>
          <Root />
        </DispatcherContextProvider>
      </AppConfigContextProvider>
    </Provider>
  );

  root.render(providers);
}

try {
  window.onload = () => initialize();
} catch (error) {
  console.error("Could not instantiate app", error);
}
