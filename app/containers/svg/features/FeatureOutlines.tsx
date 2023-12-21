import { Colors } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from "react-redux";
import { CompoundSelectors } from '../../../redux/CompoundSelectors';
import { Grid } from '../../../redux/grid/GridTypes';
import { LayerTree } from '../../../redux/layertree/LayerTreeTypes';
import { getOutlineForFeature } from '../../../redux/model/FeatureOutline';
import { getHighestFeatureId } from '../../../redux/model/ModelTree';
import { Model } from '../../../redux/model/ModelTypes';
import { SvgRectOutline } from './components/SvgRectOutline';

export const SelectionOutlineColor = Colors.ORANGE3;
export const HoverOutlineColor = Colors.COBALT3;

export const FeatureOutlines = React.memo(function FeatureOutlines() {
  const features = useSelector(Model.Selectors.getFeatures);
  const layers = useSelector(Model.Selectors.getLayers);
  const selectedNodes = useSelector(LayerTree.Selectors.getSelectedNodes);
  const transform = useSelector(Grid.Selectors.getTransform);
  const mouseMode = useSelector(Grid.Selectors.getMouseMode);
  const editingFeatureClipRegion = useSelector(Grid.Selectors.getEditingFeatureClipRegion);

  const selectedFeatures: Model.Types.Feature[] = [];
  for (const id of selectedNodes) {
    const feature = features.byId[id];
    if (feature != null) {
      selectedFeatures.push(feature);
    }
  }
  const hoveredFeatureIds = useSelector(CompoundSelectors.getHoveredFeaturesMemoized);
  const hoveringSelectedFeature = selectedFeatures.find((feature) => hoveredFeatureIds.indexOf(feature.id) >= 0);
  const resizing = mouseMode === Grid.Types.MouseMode.ResizePath || mouseMode === Grid.Types.MouseMode.ResizeRectangle;

  const selectedFeatureOutlines = selectedFeatures.map((feature) => {
    const outline = getOutlineForFeature(feature);
    const hovered = hoveredFeatureIds.indexOf(feature.id) >= 0;
    return (
      <SvgRectOutline
        key={feature.id}
        geometry={outline}
        transform={transform}
        color={SelectionOutlineColor}
        hoverCrosshair={hovered && !resizing && editingFeatureClipRegion == null}
      />
    );
  });

  const renderHoverOutlines = (
    mouseMode === Grid.Types.MouseMode.None &&
    hoveredFeatureIds.length > 0 &&
    !hoveringSelectedFeature &&
    editingFeatureClipRegion == null
  );

  function HoverOutline(): JSX.Element {
    const highestFeatureId = getHighestFeatureId(features, layers, hoveredFeatureIds);
    const highestFeature = features.byId[highestFeatureId];
    const highestFeatureOutline = getOutlineForFeature(highestFeature);
    return (
      <SvgRectOutline
        geometry={highestFeatureOutline}
        transform={transform}
        color={HoverOutlineColor}
      />
    );
  }

  return (
    <g className='feature-outlines'>
      <g className='selected-features'>{selectedFeatureOutlines}</g>
      <g className='hovered-features'>
        {renderHoverOutlines && <HoverOutline />}
      </g>
    </g>
  );
});
