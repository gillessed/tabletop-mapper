import * as React from 'react';
import { useSelector } from 'react-redux';
import { same } from '../../../../math/Vector';
import { Grid } from '../../../../redux/grid/GridTypes';
import { LayerTree } from '../../../../redux/layertree/LayerTreeTypes';
import { getOutlineForFeature } from '../../../../redux/model/FeatureOutline';
import { getFeatureTranslation, translateFeature } from '../../../../redux/model/FeatureTranslation';
import { Model } from '../../../../redux/model/ModelTypes';
import { Feature } from '../Feature';
import { renderOutline, SelectionOutlineColor } from '../FeatureOutlines';

export const FeatureDragShadows = function FeatureDragShadows() {
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const selectedFeatureIds = useSelector(LayerTree.Selectors.getSelectedFeatureIds);
  const mousePosition = useSelector(Grid.Selectors.getMousePosition);
  const features = useSelector(Model.Selectors.getFeatures);
  const mouseDragOrigin = useSelector(Grid.Selectors.getMouseDragOrigin);
  const transform = useSelector(Grid.Selectors.getTransform);
  const mouseOnCanvas = useSelector(Grid.Selectors.getMouseOnCanvas);

  if (
    mouseMode != Grid.Types.MouseMode.TransformFeatures ||
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
  );

  const renderedItems = [];
  const featureOutlines: { [key: string]: Model.Types.Rectangle } = { };
  for (const feature of selectedFeatures) {
    const translatedFeature = translateFeature(feature, translation);
    renderedItems.push(
      <Feature
        key={`feature-${feature.id}`}
        feature={translatedFeature}
      />
    );
    featureOutlines[feature.id] = getOutlineForFeature(translatedFeature);
  }
  for (const featureId of Object.keys(featureOutlines)) {
    const outline = featureOutlines[featureId];
    renderedItems.push(<g key={`outline-${featureId}`}>{renderOutline(outline, transform, SelectionOutlineColor)}</g>);
  }
  return (
    <g opacity={0.5}>
      {renderedItems}
    </g>
  )
};
