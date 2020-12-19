import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { Root } from './containers/Root';
import { applyKeyboardNavigationListener, applyMouseNavigationListener } from './navigationListeners';
import { dispatcherCreators } from './redux/Dispatchers';
import { AppReducer } from './redux/AppReducer';
import { appSaga } from './redux/AppSaga';
import { createRegister, SagaListener } from './redux/SagaListener';
import { loggerPredicate } from './redux/Logger';
import { DispatcherContextProvider } from './DispatcherContextProvider';
import { SagaListenerContextProvider } from './SagaListenerContextProvider';

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

const sagaListeners: Set<SagaListener<any>> = new Set();
const sagaRegister = createRegister(store.dispatch);
const dispatchers = dispatcherCreators(store);
sagaMiddleware.run(appSaga, {}, sagaListeners);

const providers = (
  <Provider store={store}>
    <DispatcherContextProvider value={dispatchers}>
      <SagaListenerContextProvider value={sagaRegister}>
        <Root />
      </SagaListenerContextProvider>
    </DispatcherContextProvider>
  </Provider>
)

ReactDOM.render(
  providers as any,
  document.getElementById("content")
);
