import * as React from 'react';
import { Dispatchers } from './redux/Dispatchers';

const DisaptcherContextComponent = React.createContext<Dispatchers>(undefined);
export const DispatcherContextProvider = DisaptcherContextComponent.Provider;

export function useDispatchers() {
  return React.useContext(DisaptcherContextComponent);
}
