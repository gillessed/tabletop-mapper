import * as React from 'react';
import { Model } from '../../../redux/model/ModelTypes';
import { visitFeature } from '../../../redux/model/ModelVisitors';
import { BasicAssetFeature } from './BasicAssetFeature';

export namespace Feature {
  export interface Props {
    feature: Model.Types.Feature;
  }
}

export const Feature = React.memo(({
  feature,
}: Feature.Props) => {
  return visitFeature({
    visitBasicAsset: (f) => <BasicAssetFeature feature={f} />,
    visitPattern: (f) => { return <div></div> },
  }, feature);
});
