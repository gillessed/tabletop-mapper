import { Store } from "redux";
import { ReduxState } from "./redux/AppReducer";
import { getOrderedFeatures } from "./redux/model/ModelTree";
import { Model } from "./redux/model/ModelTypes";

export function registerDebugCommands(store: Store<ReduxState>) {
  (window as any).app = {
    getState: () => store.getState(),
    getOrderedFeaturesByName: () => {
      const model = Model.Selectors.get(store.getState());
      const list = getOrderedFeatures(model.features, model.layers);
      const names = list.map((item) => item.name);
      return names;
    }
  }
}