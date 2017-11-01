import '../../less/main.less';
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
import { Navigator } from './containers/navigation/Navigator';
import { Loading } from './containers/loading/Loading';
import { Home } from './containers/home/home';
import { setRoute } from './redux/navigation/actions';
import { RootContainer } from './RootContainer';
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
                <RootContainer/>
            </SagaProvider>
        </DispatcherProvider>
    </Provider>
)

ReactDOM.render(
    providers,
    document.getElementById("content")
);