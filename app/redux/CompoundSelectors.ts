import { ReduxState } from "./AppReducer";
import { Model } from "./model/ModelTypes";
import { createSelector } from "reselect";
import { Grid } from "./grid/GridTypes";
import { Indexable } from "./utils/indexable";
import { Vector, Transform } from "../math/Vector";
import { getHoveredFeatures } from "./model/FeatureIntersection";

const getHoveredFeaturesMemoized = createSelector(
  [
    Model.Selectors.getFeatures,
    Grid.Selectors.getMousePosition,
    Grid.Selectors.getTransform,
  ],
  (
    features: Indexable<Model.Types.Feature>, 
    mousePosition: Vector, 
    transform: Transform,
  ) => {
    if (!mousePosition || !transform) {
      return [];
    }
    const coordinate = transform.applyV(mousePosition).getCoordinate();
    return getHoveredFeatures(features, coordinate, transform);
  },
)

export const CompoundSelectors = {
  getHoveredFeaturesMemoized,
};
