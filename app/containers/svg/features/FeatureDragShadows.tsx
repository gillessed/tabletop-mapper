import * as React from 'react';
import { useSelector } from 'react-redux';
import { same } from '../../../math/Vector';
import { Grid } from '../../../redux/grid/GridTypes';
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { getFeatureTranslation, translateFeature } from '../../../redux/model/FeatureTranslation';
import { Model } from '../../../redux/model/ModelTypes';
import { Feature } from './Feature';

export const FeatureDragShadows = function FeatureDragShadows() {
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const selectedFeatureIds = useSelector(LayerTree.Selectors.getSelectedNodes);
  const mousePosition = useSelector(Grid.Selectors.getMousePosition);
  const features = useSelector(Model.Selectors.getFeatures);
  const styles = useSelector(Model.Selectors.getStyles);
  const mouseDragOrigin = useSelector(Grid.Selectors.getMouseDragOrigin);
  const transform = useSelector(Grid.Selectors.getTransform);

  if (
    mouseMode != Grid.Types.MouseMode.DragFeatures ||
    mouseDragOrigin == null ||
    mousePosition == null ||
    same(mouseDragOrigin, mousePosition) ||
    selectedFeatureIds.length === 0
  ) {
    return null;
  }
  const selectedFeatures = selectedFeatureIds.map((id) => features.byId[id]);

  const translation = getFeatureTranslation(
    mousePosition,
    mouseDragOrigin,
    transform,
    selectedFeatures,
  )

  const renderedShadows = [];
  for (const feature of selectedFeatures) {
    const translatedFeature = translateFeature(feature, translation);
    const style = styles.byId[feature.styleId];
    renderedShadows.push(
      <Feature
        key={feature.id}
        geometry={translatedFeature.geometry}
        style={style}
      />
    );
  }
  return (
    <g opacity={0.5}>
      {renderedShadows}
    </g>
  )
};
