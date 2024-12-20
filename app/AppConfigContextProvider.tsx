import * as React from "react";
import { AppConfig } from "./config/AppConfig";

const AppConfigContextComponent = React.createContext<AppConfig>(undefined);
export const AppConfigContextProvider = AppConfigContextComponent.Provider;

export function useAppConfig() {
  return React.useContext(AppConfigContextComponent);
}
