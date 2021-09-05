import * as React from 'react';
import { useSelector } from 'react-redux';
import { same } from '../../../../math/Vector';
import { Grid } from '../../../../redux/grid/GridTypes';
import { LayerTree } from '../../../../redux/layertree/LayerTreeTypes';
import { getFeatureTranslation, translateFeature, translateGeometry } from '../../../../redux/model/FeatureTranslation';
import { Model } from '../../../../redux/model/ModelTypes';
import { Feature } from '../Feature';

export const FeatureDragShadows = function FeatureDragShadows() {
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const selectedFeatureIds = useSelector(LayerTree.Selectors.getSelectedNodes);
  const mousePosition = useSelector(Grid.Selectors.getMousePosition);
  const features = useSelector(Model.Selectors.getFeatures);
  const mouseDragOrigin = useSelector(Grid.Selectors.getMouseDragOrigin);
  const transform = useSelector(Grid.Selectors.getTransform);
  const mouseOnCanvas = useSelector(Grid.Selectors.getMouseOnCanvas);

  if (
    mouseMode != Grid.Types.MouseMode.DragFeatures ||
    mouseDragOrigin == null ||
    mousePosition == null ||
    same(mouseDragOrigin, mousePosition) ||
    selectedFeatureIds.length === 0 ||
    !mouseOnCanvas
  ) {
    return null;
  }
  const selectedFeatures = selectedFeatureIds.map((id) => features.byId[id]);

  const translation = getFeatureTranslation(
    mousePosition,
    mouseDragOrigin,
    transform,
    selectedFeatures.map((feature) => feature.geometry),
  )

  const renderedShadows = [];
  for (const feature of selectedFeatures) {
    const translatedFeature = translateFeature(feature, translation);
    renderedShadows.push(
      <Feature
        key={feature.id}
        feature={translatedFeature}
      />
    );
  }
  return (
    <g opacity={0.5}>
      {renderedShadows}
    </g>
  )
};
