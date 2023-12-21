import * as React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '../../../../redux/grid/GridTypes';
import { getOutlineForFeature } from '../../../../redux/model/FeatureOutline';
import { SvgRectOutline } from '../components/SvgRectOutline';
import { Feature } from '../Feature';
import { SelectionOutlineColor } from '../FeatureOutlines';

export const FeatureResizeShadows = React.memo(function FeatureResizeShadows() {
  const resizedFeature = useSelector(Grid.Selectors.getResizedFeature);
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const transform = useSelector(Grid.Selectors.getTransform);


  const isResizing = mouseMode === Grid.Types.MouseMode.ResizeRectangle || mouseMode === Grid.Types.MouseMode.ResizePath;
  if (!isResizing || resizedFeature == null) {
    return null;
  }

  const outline = getOutlineForFeature(resizedFeature);

  return (
    <g opacity={0.5}>
      <Feature feature={resizedFeature} />
      <SvgRectOutline
        geometry={outline}
        transform={transform}
        color={SelectionOutlineColor}
      />
    </g>
  )
});
