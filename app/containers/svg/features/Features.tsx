import * as React from 'react';
import { useSelector } from "react-redux";
import { treeWalk } from '../../../redux/model/ModelTree';
import { Model } from '../../../redux/model/ModelTypes';
import { Feature } from './Feature';

export const Features = function Features() {
  const features = useSelector(Model.Selectors.getFeatures);
  const layers = useSelector(Model.Selectors.getLayers);

  const renderedFeatures = React.useMemo(() => {
    const elements: JSX.Element[] = [];
    treeWalk(features, layers, {
      visitFeature: (feature) => {
        elements.push(<Feature
          key={feature.id}
          feature={feature}
        />);
      }
    });
    return elements;
  }, [features, layers]);

  return <g className='rendered-features'> {renderedFeatures} </g>;
};
