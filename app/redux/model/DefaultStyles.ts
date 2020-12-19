import { Model } from "./ModelTypes";
import { Colors, IconName } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export interface DefaultStyle extends Model.Types.Style {
  nameTemplate: string;
  icon: IconName;
}

export const DefaultSvgStyle: Model.Types.SvgStyle & DefaultStyle = {
  id: 'DefaultSvgStyle',
  name: 'Default SVG',
  type: 'svg',
  fill: 'none',
  stroke: Colors.BLACK,
  strokeWidth: 0.1,
  strokeOpacity: 1,
  pointRadius: 0.2,
  editable: false,
  nameTemplate: 'SVG',
  icon: IconNames.POLYGON_FILTER,
}

export const DefaultBasicAssetStyle: Model.Types.BasicAssetStyle & DefaultStyle = {
  id: 'DefaultBasicAssetStyle',
  name: 'Default Basic Asset',
  type: 'basic-asset',
  editable: false,
  nameTemplate: 'Basic Asset',
  icon: IconNames.MEDIA,
}
