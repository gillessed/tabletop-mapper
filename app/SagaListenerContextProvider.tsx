import * as React from 'react';
import { SagaRegistration } from './redux/SagaListener';

const SagaListenerContextComponent = React.createContext<SagaRegistration>(undefined);
export const SagaListenerContextProvider = SagaListenerContextComponent.Provider;

export function useSagaListeners() {
  return React.useContext(SagaListenerContextComponent);
}
