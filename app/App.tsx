import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { AppConfigFiles, createNewAppConfig, writeAppConfig, readAppConfig } from './config/AppConfig';
import { Root } from './containers/Root';
import { DispatcherContextProvider } from './DispatcherContextProvider';
import { applyKeyboardNavigationListener, applyMouseNavigationListener } from './navigationListeners';
import { AppReducer } from './redux/AppReducer';
import { appSaga, SagaContext } from './redux/AppSaga';
import { dispatcherCreators } from './redux/Dispatchers';
import { loggerPredicate } from './redux/Logger';
import { createRegister, SagaListener } from './redux/SagaListener';
import { SagaListenerContextProvider } from './SagaListenerContextProvider';
import { getAppDir } from './utils/appDir';
import { etn } from './etn';
import { AppConfigContextProvider } from './AppConfigContextProvider';
import { Toaster, Spinner, Colors, Classes, Intent } from '@blueprintjs/core';
import { readAssetDataFile } from './redux/asset/AssetDataFile';
import { Asset } from './redux/asset/AssetTypes';

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

  const appDir = getAppDir();
  await appDir.mkdirP();
  const appConfigFile = getAppDir().resolve(AppConfigFiles.appConfigFilename);
  const appConfigExists = await appConfigFile.exists();
  if (!appConfigExists) {
    const newAppConfig = createNewAppConfig(appDir, AppVersion);
    await writeAppConfig(appConfigFile, newAppConfig);
  }
  const appConfig = await readAppConfig(appConfigFile);
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
  applyMouseNavigationListener(store);
  applyKeyboardNavigationListener(store);

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
} catch {
  etn().dialog.showErrorBox('Error', 'There was a problem initializing the application.');
  etn().app.quit();
}
