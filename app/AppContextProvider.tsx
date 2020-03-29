import * as React from 'react';
import { Dispatchers } from './redux/dispatchers';
import { SagaRegistration } from './redux/SagaListener';

export interface AppContext {
  dispatchers: Dispatchers;
  sagaRegister: SagaRegistration;
}

const ContextComponent = React.createContext<AppContext>(undefined);
export const AppContextProvider = ContextComponent.Provider;
export const AppContextConsumer = ContextComponent.Consumer;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withAppContext<
  P extends { appContext?: AppContext },
  R = Omit<P, 'appContext'>,
  >(Component: React.ComponentClass<P> | React.StatelessComponent<P>) {
  return function (props: R) {
    const ShittyComponent = Component as any;
    return (
      <AppContextConsumer>
        {value => <ShittyComponent {...props} appContext={value} />}
      </AppContextConsumer>
    );
  };
}