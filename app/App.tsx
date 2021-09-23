import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { AppConfigFiles, createNewAppConfig, writeAppConfig, readAppConfig } from './config/AppConfig';
import { Root } from './containers/Root';
import { DispatcherContextProvider } from './DispatcherContextProvider';
import { AppReducer } from './redux/AppReducer';
import { appSaga, SagaContext } from './redux/AppSaga';
import { dispatcherCreators } from './redux/Dispatchers';
import { loggerPredicate } from './redux/Logger';
import { createRegister, SagaListener } from './redux/SagaListener';
import { SagaListenerContextProvider } from './SagaListenerContextProvider';
import { AppConfigContextProvider } from './AppConfigContextProvider';
import { Toaster, Spinner, Colors, Classes, Intent } from '@blueprintjs/core';
import { readAssetDataFile } from './redux/asset/AssetDataFile';
import { Asset } from './redux/asset/AssetTypes';
import { Filer, setFilerSeparator } from './utils/filer';
import { ipcInvoke, registerClientIpcHandlers } from './ipc/ipcInvoke';
import { Ipc } from './ipc/ipcCommands';
import './scss/Scrollbar.scss';
import { registerKeyboardShortcuts } from './KeyboardShortcuts';
import { registerDebugCommands } from './DebugCommands';

const AppVersion = '0.1.0';

function LoadingScreen() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: Colors.DARK_GRAY5,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Helvetica Neue',
      color: Colors.LIGHT_GRAY1,
      fontSize: '18px',
    }}>
      <Spinner className={Classes.DARK} size={100}/>
      <span style={{marginTop: '10px'}} > Initializing...</span>
    </div>
  );
}

async function initialize() {

  ReactDOM.render(
    <LoadingScreen />,
    document.getElementById("content")
  );

  const platformInfo = await ipcInvoke(Ipc.GetPlatformInfo);
  console.log('platform info ', platformInfo);
  const { appDirPath, separatorChar } = platformInfo;
  setFilerSeparator(separatorChar);
  const appDir = Filer.open(appDirPath);

  await appDir.mkdirP();
  const appConfigFile = appDir.resolve(AppConfigFiles.appConfigFilename);
  console.log("Checking for app config file");
  const appConfigExists = await appConfigFile.exists();
  if (!appConfigExists) {
    const newAppConfig = createNewAppConfig(appDir, AppVersion);
    console.log("Writing blank app config file");
    await writeAppConfig(appConfigFile, newAppConfig);
  }

  console.log("Reading app config");
  const appConfig = await readAppConfig(appConfigFile);

  console.log("Creating project and asset directories");
  await appConfig.projectsDir.mkdirP();
  await appConfig.assetDir.mkdirP();

  console.log('Initialized app with config', appConfig);

  const sagaMiddleware = createSagaMiddleware();

  const logger = createLogger({
    predicate: loggerPredicate,
  });

  const store = createStore(
    AppReducer,
    applyMiddleware(
      logger,
      sagaMiddleware,
    ),
  );
  registerClientIpcHandlers(store);
  registerKeyboardShortcuts(store);
  registerDebugCommands(store);

  const assets = await readAssetDataFile(appConfig);
  store.dispatch(Asset.Actions.setAssetState.create(assets));

  console.log('Initialized asset state', assets);

  const sagaListeners: Set<SagaListener<any>> = new Set();
  const sagaRegister = createRegister(store.dispatch);
  const dispatchers = dispatcherCreators(store);
  const appToaster = Toaster.create();
  const sagaContext: SagaContext = {
    appConfig,
    appToaster,
  };
  sagaMiddleware.run(appSaga, sagaContext, sagaListeners);

  const providers = (
    <Provider store={store}>
      <AppConfigContextProvider value={appConfig}>
        <DispatcherContextProvider value={dispatchers}>
          <SagaListenerContextProvider value={sagaRegister}>
            <Root />
          </SagaListenerContextProvider>
        </DispatcherContextProvider>
      </AppConfigContextProvider>
    </Provider>
  )

  ReactDOM.render(
    providers as any,
    document.getElementById("content")
  );
}

try {
  initialize();
} catch (error) {
  console.error('Could not instantiate app', error);
}
