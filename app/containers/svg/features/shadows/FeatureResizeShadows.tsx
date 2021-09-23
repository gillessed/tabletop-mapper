import * as React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '../../../../redux/grid/GridTypes';
import { getOutlineForFeature } from '../../../../redux/model/FeatureOutline';
import { Feature } from '../Feature';
import { renderOutline, SelectionOutlineColor } from '../FeatureOutlines';

export const FeatureResizeShadows = function FeatureDragShadows() {
  const resizedFeature = useSelector(Grid.Selectors.getResizedFeature);
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const transform = useSelector(Grid.Selectors.getTransform);

  const isResizing = mouseMode === Grid.Types.MouseMode.ResizeRectangle || mouseMode === Grid.Types.MouseMode.ResizePath;
  if (!isResizing || resizedFeature == null) {
    return null;
  }

  const outline = getOutlineForFeature(resizedFeature);
  const renderedOutline = renderOutline(outline, transform, SelectionOutlineColor);

  return (
    <g opacity={0.5}>
      <Feature feature={resizedFeature} />
      {renderedOutline}
    </g>
  )
};
