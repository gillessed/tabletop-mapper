import * as React from 'react';
import { useSelector } from "react-redux";
import { Model } from '../../../redux/model/ModelTypes';
import { treeWalk } from '../../../redux/model/TreeWalk';
import { PathFeature } from './PathFeature';
import { PointFeature } from './PointFeature';
import { RectangleFeature } from './RectangleFeature';
import { CircleFeature } from './CircleFeature';

function renderFeature(feature: Model.Types.Feature) {
  switch (feature.geometry.type) {
    case 'point':
      return <PointFeature key={feature.id} feature={feature as Model.Types.Feature<Model.Types.Point>} />;
    case 'rectangle':
      return <RectangleFeature key={feature.id} feature={feature as Model.Types.Feature<Model.Types.Rectangle>} />;
    case 'path':
      return <PathFeature key={feature.id} feature={feature as Model.Types.Feature<Model.Types.Path>} />
    case 'circle':
      return <CircleFeature key={feature.id} feature={feature as Model.Types.Feature<Model.Types.Circle>} />
  }
}

export const Features = React.memo(function Features() {
  const model = useSelector(Model.Selectors.get);

  const renderedFeatures: React.ReactNode[] = [];
  treeWalk(model, (feature) => {
    renderedFeatures.push(renderFeature(feature));
  });

  return <>{renderedFeatures}</>;
});
