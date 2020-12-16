import * as React from 'react';
import { useSelector } from "react-redux";
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { getOutlineForFeature } from '../../../redux/model/FeatureOutline';
import { Model } from '../../../redux/model/ModelTypes';
import { Transform } from '../../../math/Vector';
import { Grid } from '../../../redux/grid/GridTypes';
import { Colors } from '@blueprintjs/core';

const OutlinePixelStrokeWidth = 5;
const OutlinePixelPadding = 5;
const OutlineColor = Colors.ORANGE3;

function renderOutline(geometry: Model.Types.Geometry, transform: Transform): React.ReactNode | null {
  if (geometry === null) {
    return null;
  };
  if (Model.Types.isRectangle(geometry)) {
    const strokeWidth = transform.applyScalar(OutlinePixelStrokeWidth);
    const outlinePadding = transform.applyScalar(OutlinePixelPadding);
    const totalPadding = outlinePadding + strokeWidth / 2;
    const { p1, p2 } = geometry;
    return (
      <rect
        x={p1.x - totalPadding}
        y={p1.y - totalPadding}
        width={p2.x - p1.x + 2 * totalPadding}
        height={p2.y - p1.y + 2 * totalPadding}
        fill='none'
        stroke={OutlineColor}
        strokeWidth={strokeWidth}
      />
    );
  } else if (Model.Types.isCircle(geometry)) {
    const strokeWidth = transform.applyScalar(OutlinePixelStrokeWidth);
    const outlinePadding = transform.applyScalar(OutlinePixelPadding);
    const radius = geometry.r + outlinePadding + strokeWidth / 2;
    return (
      <circle
        cx={geometry.p.x}
        cy={geometry.p.y}
        r={radius}
        fill='none'
        stroke={OutlineColor}
        strokeWidth={strokeWidth}
      />
    )
  } else {
    console.error('Outline geometry should only be circles and rectangles', geometry);
    throw Error();
  }
}

export const FeatureOutlines = React.memo(function Features() {
  const model = useSelector(Model.Selectors.get);
  const selectedNodes = useSelector(LayerTree.Selectors.getSelectedNodes);
  const transform = useSelector(Grid.Selectors.getTransform);
  const selectedFeatures = [];
  for (const id of selectedNodes) {
    const feature = model.features.byId[id];
    if (feature != null) {
      selectedFeatures.push(feature);
    }
  }

  const featureOutlines = selectedFeatures.map((feature) => {
    const outline = getOutlineForFeature(feature);
    const renderedOutline = renderOutline(outline, transform);
    return renderedOutline;
  });

  return <g className='feature-outlines'> {featureOutlines} </g>;
});
