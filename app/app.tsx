import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { AppContext, AppContextProvider } from './AppContextProvider';
import { Root } from './containers/Root';
import { applyKeyboardNavigationListener, applyMouseNavigationListener } from './navigationListeners';
import { dispatcherCreators } from './redux/dispatchers';
import { rootReducer } from './redux/rootReducer';
import { rootSaga } from './redux/rootSaga';
import { createRegister, SagaListener } from './redux/SagaListener';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(
    logger,
    sagaMiddleware,
  ),
);
applyMouseNavigationListener(store);
applyKeyboardNavigationListener(store);

const sagaListeners: Set<SagaListener<any>> = new Set();
const sagaRegister = createRegister(store.dispatch);
const dispatchers = dispatcherCreators(store);
sagaMiddleware.run(rootSaga, {}, sagaListeners);
const appContext: AppContext = {
  dispatchers,
  sagaRegister,
};

const providers = (
  <Provider store={store}>
    <AppContextProvider value={appContext}>
      <Root />
    </AppContextProvider>
  </Provider>
)

ReactDOM.render(
  providers as any,
  document.getElementById("content")
);