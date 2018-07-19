import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from './redux/rootReducer';
import logger from 'redux-logger';
import { DispatcherProvider } from './dispatcherProvider';
import { SagaProvider } from './sagaProvider';
import { SagaListener } from './redux/sagaListener';
import { dispatcherCreators } from './redux/dispatchers';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './redux/rootSaga';
import { Root } from './containers/Root';
import { etn } from './etn';
import { applyMouseNavigationListener, applyKeyboardNavigationListener } from './navigationListeners';

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
sagaMiddleware.run(rootSaga, sagaListeners);

const providers = (
    <Provider store={store}>
        <DispatcherProvider dispatchers={dispatcherCreators}>
            <SagaProvider listeners={sagaListeners}>
                <Root/>
            </SagaProvider>
        </DispatcherProvider>
    </Provider>
)

ReactDOM.render(
    providers,
    document.getElementById("content")
);