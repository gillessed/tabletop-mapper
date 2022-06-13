import { Model } from "../../../redux/model/ModelTypes";
import * as React from "react";
import { FeatureRow } from "./FeatureRow";
import { MirroredSwitch } from "./components/MirroredSwitch";
import { RotationSlider } from "./components/RotationSlider";
import { ImageFillDropdown } from "./components/ImageFillDropdown";
import { SnapToGridSwitch } from "./components/SnapToGridSwitch";
import { OpacitySlider } from "./components/OpacitySlider";
import { ClipRegionWidget } from "./components/ClipRegionWidget";

export interface BasicAssetFeaturePropertiesProps {
  feature: Model.Types.BasicAssetFeature;
}

export const BasicAssetFeatureProperties = React.memo(({
  feature
}: BasicAssetFeaturePropertiesProps) => {
  const {
    id,
    mirrored,
    rotation,
    geometry,
    objectCover,
    opacity,
    clipRegion,
  } = feature;
  const { snapToGrid } = geometry;
  return (
    <div className='feature-body'>
      <FeatureRow name="Grid">
        <SnapToGridSwitch
          featureId={id}
          snapToGrid={!!snapToGrid}
        />
      </FeatureRow>
      <FeatureRow name="Orientation">
        <MirroredSwitch featureId={id} mirrored={mirrored} />
      </FeatureRow>
      <FeatureRow name="Rotation">
        <RotationSlider
          featureId={id}
          rotation={rotation}
          snapToGrid={snapToGrid}
        />
      </FeatureRow>
      <FeatureRow name="Opacity">
        <OpacitySlider
          featureId={id}
          opacity={opacity}
        />
      </FeatureRow>
      <FeatureRow name="Image">
        <ImageFillDropdown
          featureId={id}
          imageFill={objectCover}
        />
      </FeatureRow>
      <FeatureRow name="Clip Region">
        <ClipRegionWidget
          featureId={id}
          geometry={geometry}
          clipRegion={clipRegion}
        />
      </FeatureRow>
    </div>
  );
})